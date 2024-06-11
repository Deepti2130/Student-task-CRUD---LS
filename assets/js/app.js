const cl = console.log;
const stdform = document.getElementById("stdform"); //1.select the id for binding the event and controls 
const nostd = document.getElementById("nostd");
const stdcontainer = document.getElementById("stdcontainer");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn")
const fnameControl = document.getElementById("fname");
const lnameControl = document.getElementById("lname");
const emailControl = document.getElementById("email");
const contactControl = document.getElementById("contact");





const templatingofStd = (arr) => {
    if(arr.length > 0){
    let result = ``;
    arr.forEach((std,i) => {

        result += `
                    <tr id="${std.stdId}">
                    <td>${i + 1}</td>
                    <td>${std.fname}</td>
                    <td>${std.lname}</td>
                    <td>${std.email}</td>
                    <td>${std.contact}</td>
                    <td>
                    <button class="btn bg-purple btn-sm" onclick="onEdit(this)">Edit</button>
                    </td>
                    <td>
                    <button class="btn btn-danger btn-sm" onclick="onremove(this)">Remove</button>
                    </td>
                    </tr> 
                 `
    })
    
    stdcontainer.innerHTML = result;
    stdcontainer.closest(`table`).classList.remove(`d-none`);
    nostd.classList.add(`d-none`);
}else{
    stdcontainer.closest(`table`).classList.add(`d-none`);
    nostd.classList.remove(`d-none`);
}

}
// let stdArr = [];
// if(localStorage.getItem("stdArr")){
//     stdArr = JSON.parse(localStorage.getItem("stdArr"));
//     templatingofStd(stdArr);
// }

let stdArr = JSON.parse(localStorage.getItem("stdArr")) || []
templatingofStd(stdArr)

const generateUuid = () => {
    return (
        String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;

        return value.toString(16);
    });
};

const onEdit = (ele) => {
    cl(ele);
    
    let editId = ele.closest(`tr`).id;
    cl(editId);
    localStorage.setItem("editId", editId); //we need to data store in LS for updating obj
    
    let editObj = stdArr.find(std => std.stdId === editId);
    cl(editObj);
    
    fnameControl.value = editObj.fname
    lnameControl.value = editObj.lname
    emailControl.value = editObj.email
    contactControl.value = editObj.contact
    
    updatebtn.classList.remove(`d-none`)
    submitbtn.classList.add(`d-none`)
    }

const onremove = (ele) => {
    let getconfirmation = confirm(`Are you sure, you want to remove this student?`);
    cl(getconfirmation)//Confirm return boolean
    if(getconfirmation){
        let removeId = ele.closest("tr").id;

        let getIndex = stdArr.findIndex(std => std.stdId === removeId);

        stdArr.splice(getIndex, 1);
        localStorage.setItem(`stdArr`, JSON.stringify(stdArr));
        ele.closest("tr").remove()

        swal.fire({
            title:`Student id ${removeId} info is removed successfully !!!`,
            timer:3000,
            icon:`success`
        })
    }
}

const onupdatestd = () =>{

    let updateId = localStorage.getItem(`editId`);
    cl(updateId);

    let updatedObj = 
        {fname: fnameControl.value,
        lname: lnameControl.value,
        email: emailControl.value,
        contact: contactControl.value,
        stdId:updateId,
    }


        let getIndex = stdArr.findIndex(std => std.stdId === updateId);
        cl(getIndex)

        stdArr[getIndex] = updatedObj;
        localStorage.setItem(`stdArr`, JSON.stringify(stdArr));

        let tr = [...document.getElementById(updateId).children];
        tr[1].innerHTML = updatedObj.fname;
        tr[2].innerHTML = updatedObj.lname;
        tr[3].innerHTML = updatedObj.email;
        tr[4].innerHTML = updatedObj.contact;
       
        stdform.reset()
        updatebtn.classList.add(`d-none`);
        submitbtn.classList.remove(`d-none`);

        swal.fire({
            title:`Student with id ${updateId} is updated successfully !!!`,
            timer:2500,
            icon:`success`
        })
}


const onstdAdd = (eve) =>{  //3.callback function >> create new obj
    eve.preventDefault();
    let newstd = {
        fname: fnameControl.value,
        lname: lnameControl.value,
        email: emailControl.value,
        contact: contactControl.value,
        stdId:generateUuid()
    }
    stdArr.push(newstd); //4.object push in array
    cl(stdArr);
    stdform.reset()

    //5. store the array in LS
    localStorage.setItem(`stdArr`,JSON.stringify(stdArr));
    

//6.templating of array >> We will create one tr and append
// templatingofStd(stdArr)
   
let tr = document.createElement(`tr`);
tr.id = newstd.stdId;

tr.innerHTML = `<td>${stdArr.length}</td>
                    <td>${newstd.fname}</td>
                    <td>${newstd.lname}</td>
                    <td>${newstd.email}</td>
                    <td>${newstd.contact}</td>
                    <td>
                    <button class="btn bg-purple btn-sm" onclick="onEdit(this)">Edit</button>
                    </td>
                    <td>
                    <button class="btn btn-danger btn-sm" onclick="onremove(this)">Remove</button>
                    </td>`

stdcontainer.append(tr)


swal.fire({
    title:`New student ${newstd.fname} ${newstd.lname} is added successfully`,
    timer:2500,
    icon:"success"

})

}



stdform.addEventListener("submit", onstdAdd) //2. bind the event by submit event//
updatebtn.addEventListener("click", onupdatestd)