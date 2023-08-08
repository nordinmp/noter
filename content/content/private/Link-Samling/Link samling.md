#link 
``` dataviewjs

for (let group of dv.pages('#link AND "Link-Samling"').where(p => p.type != null).groupBy(p => p.type)) { 
	dv.header(1, group.key); 
	dv.table(["Name", "type", "date","author"], 
		group.rows 
			.sort(k => k.file.creationDate, 'desc') 
			.map(k => [k.file.name, k.type, k.date, k.author])) 
}
```
