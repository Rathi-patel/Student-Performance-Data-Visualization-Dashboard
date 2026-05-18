let marksChart
let attendanceChart

loadData()


function uploadCSV(){

let file=
document.getElementById(
"csvFile"
).files[0]

let form=
new FormData()

form.append(
"file",
file
)

fetch(
"http://127.0.0.1:8000/upload",
{
method:"POST",
body:form
})

.then(()=>loadData())

}



function loadData(){

fetch(
"http://127.0.0.1:8000/data"
)

.then(r=>r.json())

.then(data=>{

document.getElementById(
"total"
).innerText=data.total

document.getElementById(
"avg"
).innerText=data.avg_marks

document.getElementById(
"high"
).innerText=data.highest

document.getElementById(
"low"
).innerText=data.lowest


if(marksChart)
marksChart.destroy()

if(attendanceChart)
attendanceChart.destroy()


marksChart=
new Chart(
document.getElementById(
"marksChart"
),
{
type:"bar",
data:{
labels:data.names,
datasets:[{
label:"Marks",
data:data.marks
}]
}
})


attendanceChart=
new Chart(
document.getElementById(
"attendanceChart"
),
{
type:"line",
data:{
labels:data.names,
datasets:[{
label:"Attendance",
data:data.attendance
}]
}
})


createTable(data)

})

}


function createTable(data){

let table=
document.getElementById(
"preview"
)

let html=""


html+="<tr>"

data.columns.forEach(c=>{

html+=
"<th>"+c+"</th>"

})

html+="</tr>"


data.records.forEach(row=>{

html+="<tr>"

data.columns.forEach(c=>{

html+="<td>"
+row[c]+
"</td>"

})

html+="</tr>"

})

table.innerHTML=html

}