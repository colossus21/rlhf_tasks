// Not part of the notebook
let items = new Array(1000000).fill(0);
let hugeArray = new Array(1000000).fill(0);
let max = items.length;
let price = 100;
let taxRate = 0.5;
let email = "test";
function processElement(element) {
  return element * 2;
}

// Bad: This line increments i by 1
i++;

// Better: The code is clear enough on its own
i++;

// Bad: Set the name to John
userName = "John";

// Better:
userName = "John";

// This might be true now but could change if the algorithm is updated
// Bad: This always selects the first item
const selectedItem = items[0];

// Better: Let the code speak for itself or put this information in documentation that gets updated with the codebase

// Bad: This weird loop structure is to avoid a bug in old IE
for (var i = 0; i <= max; i++) {
  // Complex conditional logic here
}

// Better: Refactor the loop to be clearer or move the fix to a conditional that addresses the specific issue

// Bad: This is the total price after tax
let x = price * taxRate + price;

// Better: Use a descriptive variable name
const totalPriceAfterTax = price * taxRate + price;

// Avoid comments inside loops like this if performance is critical
for (let i = 0; i < hugeArray.length; i++) {
  // Process each element
  processElement(hugeArray[i]);
}

// Bad: Extensive comment explaining the following two lines
// This complex regular expression is designed to validate email addresses
// by following the RFC 5322 Official Standard, which involves checking for...
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isValidEmail = emailRegex.test(email);

// Better: Refactor if possible or document in a way that doesn't interrupt the code reading flow
