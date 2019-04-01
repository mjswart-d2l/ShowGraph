select 
	qs.query_hash,
	qs.plan_handle,
	cast(null as xml) as query_plan
into #myplans
from sys.dm_exec_query_stats qs
cross apply sys.dm_exec_plan_attributes(qs.plan_handle) pa
where pa.attribute = 'dbid'
and pa.value = db_id();

with duplicate_queries as
(
	select ROW_NUMBER() over (partition by query_hash order by (select 1)) r
	from #myplans
)
delete duplicate_queries
where r > 1;

update #myplans
set query_plan = qp.query_plan
from #myplans mp
cross apply sys.dm_exec_query_plan(mp.plan_handle) qp

;WITH XMLNAMESPACES (DEFAULT 'http://schemas.microsoft.com/sqlserver/2004/07/showplan'),
mycte as 
(
    select q.query_hash,
           obj.value('(@Schema)[1]', 'sysname') AS schema_name,
           obj.value('(@Table)[1]', 'sysname') AS table_name    	   
    from #myplans q
    cross apply q.query_plan.nodes('/ShowPlanXML/BatchSequence/Batch/Statements/StmtSimple') as nodes(stmt)
    CROSS APPLY stmt.nodes('.//IndexScan/Object') AS index_object(obj)    
)
select query_hash, schema_name, table_name
into #myExecutions
from mycte
where schema_name is not null
and object_id(schema_name + '.' + table_name) in (select object_id from sys.tables)
group by query_hash, schema_name, table_name;

select DISTINCT A.table_name as first_table,
       B.table_name as second_table
from #myExecutions A
join #myExecutions B
on A.query_hash = B.query_hash
where A.table_name < B.table_name;