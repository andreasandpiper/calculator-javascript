$(document).ready(initializeApp);

function initializeApp(){
  $('.number').on('click', calculator.pressNumberButton.bind(calculator));
  $('.clear').on('click', calculator.clearCalculator.bind(calculator, "0"));
  $('.clearEntry').on('click', calculator.clearLastInput.bind(calculator));
  $('.operand').on('click', calculator.pressOperandButton.bind(calculator));
  $('.equal').on('click', calculator.calculate.bind(calculator));
  $('.decimal').on('click', calculator.addDecimalToNumber.bind(calculator));
}

function displayOnCalculator(){
  if(calculator.displayScreen.length === 0){
    $('.input').text("0");
    return;
  }
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
  inParentheses: false,
  beginParenArray: [],
  endParenArray: [],
  clearCalculator: function(message){
    message = message || " ";
    this.arrayOfInputValues = [];
    this.currentNumber = '';
    this.currentOperator = '';
    this.lastFunction = {};
    this.lastInputSubmitted = null;
    calculator.displayScreen = [];
    this.beginParenArray = [],
    this.endParenArray = [],
    $('.input').text(message);
  },
  addParentheses: function(){
    //get value
    var paren = $(event.target).val();
    var addToEquation = new Value('parentheses', paren);
    if(paren === "("){
      if(this.currentNumber && !this.parentheses){
        this.arrayOfInputValues.push(new Value('operand', "*"));
        this.currentNumber = '';
      }
      this.beginParenArray.push(this.arrayOfInputValues.length);
      this.inParentheses = true;
    } else {
      this.endParenArray.push(this.arrayOfInputValues.length);
      this.inParentheses = false;
    }
    this.arrayOfInputValues.push(addToEquation);
    this.lastInputSubmitted = paren;
    this.displayScreen.push(paren);
    displayOnCalculator();
  },
  calculate: function(){
    //if no input or first input is an operator, return
    if(!this.lastInputSubmitted || this.arrayOfInputValues[0].type === "operand" || this.lastInputSubmitted === '.' || this.inParentheses || this.beginParenArray.length !== this.endParenArray.length){
      // $('.input').text('0');
      return;
    } else if (this.arrayOfInputValues.length ===2 && isNaN(this.lastInputSubmitted)){
      var addNumberToEquation = new Value('number', this.arrayOfInputValues[0].value);
      this.arrayOfInputValues.push(addNumberToEquation);
      getSumOfInput();
    }else if (this.arrayOfInputValues.length ===1) {
      //if there is only 1 number input, use previous function
      if(!this.lastFunction.operand){
        return;
      }
      var addOperatorToEquation = new Value('operand',this.lastFunction.operand );
      var addSumToEquation = new Value('number', this.lastFunction.num2);
      this.arrayOfInputValues.push(addOperatorToEquation, addSumToEquation);
      getSumOfInput();
    } else if (isNaN(this.lastInputSubmitted) && !this.beginParenArray.length) {
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
    if(this.displayScreen.length > 9 || this.lastInputSubmitted === ")"){
      return false;
    }
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
    if(this.arrayOfInputValues.length === 0 || this.displayScreen.length > 9){
      return;
    }
    this.currentNumber = '';
    var operand = $(event.target).val();
    if(this.currentOperator.length){
      this.arrayOfInputValues.pop();
      this.displayScreen.pop();
    }
    if(this.lastInputSubmitted === '.'){
      return;
    }
    this.currentOperator = operand;
    var newValue = new Value('operand', operand);
    this.arrayOfInputValues.push(newValue);
    this.lastInputSubmitted = this.currentOperator;
    this.displayScreen.push(operand);
    displayOnCalculator();
  },
  addDecimalToNumber: function (){
    if(this.displayScreen.length > 9){
      return;
    }    if(this.currentNumber.indexOf('.') === -1){
      if(this.currentNumber){
        this.arrayOfInputValues.pop();
      }
      this.currentNumber += ".";
      var newNumber = new Value('number', this.currentNumber);
      this.arrayOfInputValues.push(newNumber);
      this.lastInputSubmitted = '.';
      this.displayScreen.push(".")
      displayOnCalculator();
    }
  },
  clearLastInput: function(){
    var inputDeleted = this.displayScreen.pop();
    if(this.currentNumber.length === 1 && inputDeleted != "." || !this.lastInputSubmitted){
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
    displayOnCalculator();
  }
}

function sum(array){
  if(array.length === 1){
    return array;
  }
  var orderOfOperations = ['*', "/", "+", "-"];
  var equation;
  var num2;
  //loop through order of operations
  //find index for operation
  var operandIndex = 0;

  while(operandIndex < orderOfOperations.length){
    for(var i=0 ; i< array.length ; i++){
      if(array[i].value === orderOfOperations[operandIndex]){
        //get values before and after
        var operator = array[i].value;
        var num1 = parseFloat(array[i-1].value);
        num2 = parseFloat(array[i+1].value);
        equation = mathOperators[operator](num1, num2);
        if(equation.toString().length > 6){
          equation = equation.toExponential();
        }
        equation = equation.toString();
        var answer = new Value('number', equation);
        array.splice(i-1, 3, answer);
        i = i-1;
      }
    }
    operandIndex++;
  }
  if(equation === "Infinity"){
    // $('.input').text("error");
    calculator.clearCalculator('error');
    return;
  } else if (equation.length > 7) {
    var number = parseFloat(equation);
    number = number.toPrecision(6);
    equation = number.toString();
  }
  else {
    calculator.currentNumber = equation;
  }
  // calculator.lastInputSubmitted = null;
  calculator.lastFunction.operand = operator;
  calculator.lastFunction.num2 = num2;
  calculator.currentOperator = "";
  return equation;
}
  //idea: keep an array of operators used, sort them in order of operations and find those values
function getSumOfInput(){
  var arrayLengthShortened = 0;
  while(calculator.beginParenArray.length){
      var indexOfBeginParen;
      var indexOfEndParen;
      for(var outerLoopIndex=calculator.beginParenArray.length - 1 ; outerLoopIndex >= 0; outerLoopIndex--){
        indexOfBeginParen = calculator.beginParenArray[outerLoopIndex];
        //find the number that is closest to, but not below
        for(var innerLoopIndex = calculator.endParenArray.length - 1; innerLoopIndex >= 0  ; innerLoopIndex--){
          if(calculator.endParenArray[innerLoopIndex] > indexOfBeginParen){
            indexOfEndParen = calculator.endParenArray[innerLoopIndex];
          }
        }
      }
      // debugger;
      var copyOfSectionInParentheses = calculator.arrayOfInputValues.slice(indexOfBeginParen+1 - arrayLengthShortened, indexOfEndParen - arrayLengthShortened);
      var sumOfCopy =  new Value('number',sum(copyOfSectionInParentheses));
      calculator.arrayOfInputValues.splice(indexOfBeginParen- arrayLengthShortened, indexOfEndParen + 1- arrayLengthShortened, sumOfCopy);
      calculator.beginParenArray.splice(calculator.beginParenArray.indexOf(indexOfBeginParen- arrayLengthShortened), 1);
      calculator.endParenArray.splice(calculator.endParenArray.indexOf(indexOfEndParen- arrayLengthShortened), 1);
      arrayLengthShortened = indexOfEndParen - indexOfBeginParen;
      indexOfEndParen = null;
      indexOfBeginParen = null;
  }

  var result = sum(calculator.arrayOfInputValues);
  calculator.displayScreen= [result];
  displayOnCalculator();
}
