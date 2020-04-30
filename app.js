// the budgety app will be divided into three different modules
// the budget data module
// the ui module 
// the contoller module

// the budget data module

var budgetModule= (function(){

//creating a function constructor for all expense and income received so that they all exist as an object when received into the input field

//function constructor for expense

var Expenses = function(id,description,value){
  this.id=id;
  this.description=description;
  this.value=value
  this.percentageS=-1
}

Expenses.prototype.calculateP=function(totalInc){
if(totalInc>0){
  this.percentageS=Math.round((this.value/totalInc *100))
}
else
{
  this.percentageS=-1
}
}

Expenses.prototype.getPercentageValue=function(){
  return this.percentageS
}


//function constructor for incomes
var Incomes = function(id,description,value){
  this.id=id;
  this.description=description;
  this.value=value
}
//data strucure that stores all user input
var allData= {
   allincome:{
     exp:[],
     inc:[]
   },
   totals:{
     exp:0,
     inc:0
   },
   budget:0,
   percentage:-1
}

//function responsible for summing up the data for either the income or the expense type
var totalFunction= function(type){
    var sum=0;//initialize sum as 0

    allData.allincome[type].forEach(function(current){
      sum=sum+current.value
    })//looop through the values of the desired type and add the to the existing sum

    allData.totals[type]=sum 

}

//object where all public methods that aids this modules communication without other modules are defined
return {

  //the first method here that is the addItem method is responsible for taking the dta reeived from the ui module and with it using either the income or expenses constructor to create an object which 
  //is then added to the alldata object where all data for this project is stored 
addItem:function(type,description,value){
var newItem,Id;

//every object created which is an instance of either income or expense is given a unique id by the following code
if(allData.allincome[type].length===0){
  Id=0;
}
else{
  Id=allData.allincome[type][allData.allincome[type].length-1].id + 1;
}
//----------------------------------

//creates new instances of either the income or expenses object based on the type parameter passed to it
if(type==="exp"){
  newItem= new Expenses(Id,description,value)
}
else if(type==="inc"){
  newItem=new Incomes(Id,description,value)
}


//add the new object created to the data structue defined earlier
allData.allincome[type].push(newItem);
return newItem//return value of this method is the new item created
},
//-------------------------------------------------------------------------------------------------------------


//responsible for calculating thr budget of the data inputed---------------------------------------------------
budgetCalculator:function(){
//finc the total of the income and expenses
totalFunction("inc");
totalFunction("exp");
//find the budget
allData.budget=allData.totals.inc - allData.totals.exp;

//find the percentage
if(allData.totals.inc>0){
allData.percentage=Math.round((allData.totals.exp/allData.totals.inc)*100)}

else{
  allData.percentage= -1
}
},
//-----------------------------------------------------------------------------------------

//responsible for returning the budget and percentages to be used by other modules ----------------------------------------------
returnData:function(){
   return {
     budget:allData.budget,
     percentage:allData.percentage,
     totalIncome:allData.totals.inc,
     totalExpense:allData.totals.exp
   }
},
//--------------------------------------------------------------------------------------------------

//method for removing dta from the data object----------------------------------------------------------
removeData:function(type,id){
  var idArray,indexFig
//return an array containing the id of all elements in the exp and array object
idArray=allData.allincome[type].map(function(current){
  return current.id

})
indexFig= idArray.indexOf(id)
allData.allincome[type].splice(indexFig,1)
},
//------------------------------------------------------------------------------------

//method responsible for calculating the percentages on each instance of the expense input

calculatePercentages:function(){
   allData.allincome.exp.forEach(function(current){
      current.calculateP(allData.totals.inc)
   })
},
//-----------------------------------------------------------------------------------

//method responsible for returning the percentages values for all item in the list

getAndReturnPercentages:function(){
   var percentageValues =allData.allincome.exp.map(function(current){
    return current.getPercentageValue()
  })
  return percentageValues
}
}
})();






// the ui module-----------------------------------------------------------------------------------------------
var uiModule=(function(){

var selectorObject={
addButton:".add__btn",
typeButton:".add__type",
desButton:".add__description",
valueButton:".add__value",
containerElementIncome:".income__list",
containerElementExpense:".expenses__list",
budgetElement:".budget__value",
totalIncomeEle:".budget__income--value",
totalExpenseEle:".budget__expenses--value",
percentageComponents:".budget__expenses--percentage",
containerEle:".container",
percentageComponent:".item__percentage",
monthSelector:".budget__title--month"
}//object container the class names of all elements involved in the dom manipulation of this project

var formData= function(){ return { 
typeData:document.querySelector(selectorObject.typeButton).value,
desData:document.querySelector(selectorObject.desButton).value,
valueData:parseFloat(document.querySelector(selectorObject.valueButton).value)
}}


var formatInput=function(num,type){
  var int,numString,formatString
//ensure the number is not negative
int=Math.abs(num);
//ensure the number ends at two decimal places 
int=int.toFixed(2)
//seperate the whole number part of the number string from the decimal

numString=int.split('.')


//format the number into the correct number of commas 
if (numString[0].length>3){
numString[0]=numString[0].substr(0,numString[0].length-3)+","+numString[0].substr(numString[0].length-3,numString[0].length)
console.log(formatString)
}
//using the type add either a plus or a negative...with plus foe income type and negative for expense type 

return (type==="inc"? "+ " : "- " ) + numString[0]
}

var nodeListForEach= function(nodeL,callBack){
  for(i=0;i<nodeL.length;i++){
      callBack(nodeL[i],i);
  }}


return {
  //method responsible for returning the form input data
 setupData:function(){
   return formData()
 },
//--------------------------------------------------------------------------------------------------------------
 //method responsible for returning all selector components of the ui so they can mbe accessed in our controller module ;
 uiComponents:function(){
   return selectorObject
 },
//-------------------------------------------------------------------------------------------------------------------

 //the method bellow is responsible for adding new input values to the ui
 buildUI:function(objectO,type){
var newHtml,element,htmlSection;
  //create mock up ui to be added to the dom
   if (type==="inc"){
     element=selectorObject.containerElementIncome;
     htmlSection='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
   }
else if(type==="exp"){
  element=selectorObject.containerElementExpense
htmlSection='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
}
//replace specific areas in the mockup with data obtained from the input form
newHtml=htmlSection.replace("%id%",objectO.id)
newHtml=newHtml.replace("%description%",objectO.description);
newHtml=newHtml.replace("%value%",formatInput(objectO.value,type))
//add the ui component into the dom using the insertAdjacentHtml method
document.querySelector(element).insertAdjacentHTML("beforeEnd",newHtml)
 },
//----------------------------------------------------------------------------------------------------------------------------------

//method responsible for clearing input field and returning the focus back to the description input field
clearInputField:function(){
 var selectorArr= document.querySelectorAll(selectorObject.desButton+","+selectorObject.valueButton);

 newArr=Array.prototype.slice.call(selectorArr);
 
 newArr.forEach(function(current) {
   current.value="" 
 });
newArr[0].focus()

},
//-------------------------------------------------------------------------------------------------------

//method responsible for updating the user inerface with the calculated values for total expense,total income, budget and percentage

budgetUi:function(object){
object.budget>0?type="inc":type="exp"
  document.querySelector(selectorObject.budgetElement).textContent=formatInput(object.budget,type)
  document.querySelector(selectorObject.totalIncomeEle).textContent=formatInput(object.totalIncome,"inc")
  document.querySelector(selectorObject.totalExpenseEle).textContent=formatInput(object.totalExpense,"exp")

  if(object.totalIncome>0){
  document.querySelector(selectorObject.percentageComponents).textContent=object.percentage+"%"
  }
  else{
    document.querySelector(selectorObject.percentageComponents).textContent="----"
  }


}
,
//-------------------------------------------------------------------------------------------------------------------

//method for the deletion from ui----------------------------------------------------------------------------------

deleteUi:function(id){
document.querySelector("#"+id).parentNode.removeChild(document.querySelector("#"+id))
},

//------------------------------------------------------------------------------------------

//method responsible for adding the percentages of the expense to the ui
percentageUi: function(returneP){
  nodeList=document.querySelectorAll(selectorObject.percentageComponent);

  nodeListForEach(nodeList,function(current,index){
    if(returneP[index]>0){
     current.textContent=returneP[index]+"%"}
     else{
       current.textContent="---"
     }
  })
  },
//--------------------------------------------------------------------------------------

//the method responsible for updating the current date and year of the budget being prepared 
updateMethod:function(){
  var date
  date=new Date();
  months=["January","February","March","April","May","June","July","August","September","October","November","December"]
  month=date.getMonth();
  year=date.getFullYear();
  document.querySelector(selectorObject.monthSelector).textContent=months[month]+" "+year

},
//------------------------------------------------------------------------------------------

//the method responsible for the expense ui change
improveUi:function(){
var allSelectors;
allSelectors=document.querySelectorAll(selectorObject.typeButton+","+selectorObject.desButton+","+selectorObject.valueButton)
nodeListForEach(allSelectors,function(current){
  current.classList.toggle("red-focus")
})

document.querySelector(selectorObject.addButton).classList.toggle("red")
}
}
})()
//------------------------------------------------------------------------------------------------------------------------




// the controller module

var controllerModule=(function(budgetM,uiM){
//initialization function responsible for adding the events 
//the setupinit function is still currently a private function to this controlModule
var domObject= uiM.uiComponents()

var setupInit=function(){
  document.querySelector(domObject.addButton).addEventListener("click",addBudget)//event listener for click of button
  document.addEventListener("keypress",function(e){//event listener incase the user presses the enter key instead of clicking the button
   
    if(e.keycode===13||e.which===13)
    { 
        addBudget()
    }
  
  })
 document.querySelector(domObject.typeButton).addEventListener("change",uiM.improveUi)

  document.querySelector(domObject.containerEle).addEventListener("click",deleteList)
}

var  deleteList= function(event){
var  eleId,usefulComp
     eleId=event.target.parentNode.parentNode.parentNode.parentNode.id
     if(eleId){
     usefulComp=eleId.split("-")
     }
    //  method to reemove the deleted item from data set
     budgetM.removeData(usefulComp[0],parseInt(usefulComp[1]))
     //method to remove element from the ui
     uiM.deleteUi(eleId)
     calculateBudget()
     calculatePerc()
 }

var calculatePerc=function(){
// calculate the percentages
budgetM.calculatePercentages()
// return the percentages then used returned percentages to update ui
var percentages=budgetM.getAndReturnPercentages()

//update ui
uiM.percentageUi(percentages)

}







var calculateBudget=function(){
  //calculate the budget
 budgetM.budgetCalculator()
 //return all budget values
 var budgetValues=budgetM.returnData()
uiM.budgetUi(budgetValues);
}

var addBudget=function(){
  var uiData,newItem;
    uiData=uiM.setupData();//stores the input data from the form from the ui module
    if(uiData.desData!==""&& !isNaN(uiData.valueData)){//condition for the  ui and budget modules to be updated with the entered data
    newItem=budgetM.addItem(uiData.typeData,uiData.desData,uiData.valueData)
    uiM.buildUI(newItem,uiData.typeData)//method for updating the ui 
    uiM.clearInputField()}
    calculateBudget()
    calculatePerc()
}


//in order to make the setupInit function public i'd use a public method that implements it
return {
//method which calls the init function and also initializes the placeholder values of the elemnt to be used
  initFunction:function(){
    uiM.updateMethod()
    setupInit()
    uiM.budgetUi({
      budget:0,
      totalIncome:0,
      totalExpense:0,
      percentage:0
    })
  }

}})(budgetModule,uiModule)

controllerModule.initFunction()//calls the initialization function


