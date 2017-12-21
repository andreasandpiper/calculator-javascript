$(document).ready(initializeApp);

function initializeApp(){
  $('.number').on('click', calculator.pressNumberButton.bind(calculator));
  $('.clear').on('click', calculator.clearCalculator.bind(calculator));
  $('.clearEntry').on('click', calculator.clearLastInput.bind(calculator));
  $('.operand').on('click', calculator.pressOperandButton.bind(calculator));
  $('.equal').on('click', calculator.calculate.bind(calculator));
  $('.decimal').on('click', calculator.addDecimalToNumber.bind(calculator));
  $('.delete').on('click', calculator.deleteLastInput.bind(calculator));
}

function displayOnCalculator(){
  $('.input').text(calculator.displayScreen.join(""));
}

var mathOperators =  {
    '+': function(x,y){ return x + y},
    '-': function(x,y){ return x - y},
    '/': function(x,y){ return x / y},
    '*': function(x,y){ return x * y}
}

function Value(type, value) {
  this.type = type,
  this.value = value
}

var calculator = {
  lastFunction: {},
  currentNumber: '',
  currentOperator: '',
  lastInputSubmitted: null,
  arrayOfInputValues: [],
  displayScreen: [],
  deleteLastInput: function(){

  },
  clearCalculator: function(){
    this.arrayOfInputValues = [];
    this.currentNumber = '';
    this.currentOperator = '';
    $('.input').text("");
    calculator.displayScreen = [];
  },
  // clearAllInput: function(){
  //   this.lastFunction = {};
  //   this.arrayOfInputValues = [];
  //   this.currentNumber = '';
  //   this.currentOperator = '';
  //   this.lastInputSubmitted = null;
  // },
  calculate: function(){
    //if no input or first input is an operator, return
    if(!this.lastInputSubmitted || this.arrayOfInputValues[0].type === "operand" || this.lastInputSubmitted === '.'){
      return;
    } else if (this.arrayOfInputValues.length ===2 && isNaN(this.lastInputSubmitted)){
      var addNumberToEquation = new Value('number', this.arrayOfInputValues[0].value);
      this.arrayOfInputValues.push(addNumberToEquation);
      getSumOfInput();
    }else if (this.arrayOfInputValues.length ===1) {
      //if there is only 1 number input, use previous function
      var addOperatorToEquation = new Value('operand',this.lastFunction.operand );
      var addSumToEquation = new Value('number', this.lastFunction.num2);
      this.arrayOfInputValues.push(addOperatorToEquation, addSumToEquation);
      getSumOfInput();
    } else if (isNaN(this.lastInputSubmitted)) {
      //if the last input is an operand
      //calculate equation from input
        //remember last 2 operand and number
      //change screen display
      var operator = this.arrayOfInputValues.pop();
      if(this.arrayOfInputValues.length !== 1){
        getSumOfInput();
      }
      this.lastFunction.num2 = this.arrayOfInputValues[0].value;
      var addOperatorToEquation = new Value('operand',this.lastFunction.operand );
      var addSumToEquation = new Value('number', this.lastFunction.num2);
      this.arrayOfInputValues.push(addOperatorToEquation, addSumToEquation);
      getSumOfInput();
    } else {
      //if the first input is a number
      var answer = getSumOfInput();
    }
  },
  pressNumberButton: function(){
    var number = $(event.target).text();
    if(this.currentNumber.length){
      // if(this.lastInputSubmitted != '.'){
      //   this.displayScreen.pop();
      // }
      this.arrayOfInputValues.pop();
    }
    this.currentNumber += number;
    var newValue = new Value('number', this.currentNumber);
    this.arrayOfInputValues.push(newValue);
    this.currentOperator = '';
    this.lastInputSubmitted = this.currentNumber;
    this.displayScreen.push(number)
    displayOnCalculator();
  },
  pressOperandButton: function(){
    // debugger;
    this.currentNumber = '';
    var operand = $(event.target).val();
    if(this.currentOperator.length){
      this.arrayOfInputValues.pop();
      this.displayScreen.pop();
    }
    if(this.lastInputSubmitted === '.'){

    }
    this.currentOperator = operand;
    var newValue = new Value('operand', operand);
    this.arrayOfInputValues.push(newValue);
    this.lastInputSubmitted = this.currentOperator;
    this.displayScreen.push(operand);
    displayOnCalculator();
  },
  addDecimalToNumber: function (){
    if(this.currentNumber && this.currentNumber[this.currentNumber.length -1] !== '.' && this.currentNumber.indexOf('.') === -1){
      this.currentNumber += ".";
      this.lastInputSubmitted = '.';
      this.displayScreen.push(".")
      displayOnCalculator();
    }
  },
  clearLastInput: function(){
    var inputDeleted = this.displayScreen.pop();
    if(!isNaN(inputDeleted) && this.currentNumber.length === 1 || inputDeleted === "." || !this.lastInputSubmitted){
      this.arrayOfInputValues.pop();
      this.currentNumber = '';
      this.currentOperator = inputDeleted;
    }
    else if (!isNaN(inputDeleted) || inputDeleted === "." ){
        this.arrayOfInputValues.pop();
        var number = this.currentNumber.slice(0, this.currentNumber.length - 1);
        var newNumber = new Value('number', number);
        this.arrayOfInputValues.push(newNumber);
        this.currentNumber = number;
    }
    else{
      this.arrayOfInputValues.pop();
      this.currentOperator = "";
      this.currentNumber = this.arrayOfInputValues[this.arrayOfInputValues.length - 1].value;
      displayOnCalculator();
    }
    this.lastInputSubmitted = this.displayScreen[this.displayScreen.length - 1];
    // var lastSubmitted = this.displayScreen.pop()
    // if(!isNaN(lastSubmitted) || this.lastInputSubmitted === '.'){
    //   if(lastSubmitted === this.arrayOfInputValues[this.arrayOfInputValues.length - 1].value){
    //     this.arrayOfInputValues.pop();
    //   } else {
    //     var removeLastDigitOfTargetNumber = this.arrayOfInputValues[this.arrayOfInputValues.length - 1].value.slice(0,-1);
    //     var newNumber = this.arrayOfInputValues[this.arrayOfInputValues.length - 1].value.slice(0, this.arrayOfInputValues.length);
    //     console.log(removeLastDigitOfTargetNumber)
    //     this.arrayOfInputValues[this.arrayOfInputValues.length - 1].value = newNumber;
    //     this.currentNumber = removeLastDigitOfTargetNumber;
    //     this.lastInputSubmitted = removeLastDigitOfTargetNumber;
    //   }
    // } else {
    //   this.arrayOfInputValues.pop();
    //   this.currentOperator = '';
    //   this.lastInputSubmitted = this.displayScreen[this.displayScreen.length -1];
    // }
    displayOnCalculator();
  }
}
  //idea: keep an array of operators used, sort them in order of operations and find those values
function getSumOfInput(){
  for(var i=0 ; i< calculator.arrayOfInputValues.length ; i++){
    if(calculator.arrayOfInputValues[i].type === 'operand' ){
      //get values before and after
      var operator = calculator.arrayOfInputValues[i].value;
      var num1 = parseFloat(calculator.arrayOfInputValues[i-1].value);
      var num2 = parseFloat(calculator.arrayOfInputValues[i+1].value);
      var equation = mathOperators[operator](num1, num2);
      equation = equation.toString();
      var answer = new Value('number', equation);
      calculator.arrayOfInputValues.splice(i-1, 3, answer);
      i = i-1;
    }

    if(equation === "Infinity"){
      $('.input').text("error");
      calculator.currentNumber = null;
      calculator.displayScreen = [];
    } else {
      calculator.currentNumber = equation;
      $('.input').text(equation);
      calculator.displayScreen = [equation];
    }
    this.lastInputSubmitted = null;
    calculator.lastFunction.operand = operator;
    calculator.lastFunction.num2 = num2;
    calculator.currentOperator = "";
  }
  return equation;
}
