function Account(iban, owner, balance) {
  this.iban = iban;
  this.owner = owner;
  this.balance = balance;
  this.getBalance = function () {
    return this.balance;
  };
  //typeof NaN
  this.deposit = function (amount) {
    if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
      return false;
    } else {
      this.balance += amount;
      return true;
    }
  };
  this.withdraw = function (amount) {
    if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
      return false;
    }
    if (this.balance < amount) {
      return false;
    }

    this.balance -= amount;
    return true;
  };
}

function transfer(acc1, acc2, amount) {
  //Step 1 - withdraw
  if (!acc1.withdraw(amount)) {
    //fail
    return new Transaction(acc1, acc2, amount, "не смогли списать");
  }
  //Step 2 - deposit
  if (!acc2.deposit(amount)) {
    // fail
    return new Transaction(acc1, acc2, amount, "не смогли зачислить");
  }
  // Step 3 - success
  return new Transaction(acc1, acc2, amount);
}

function Transaction(acc1, acc2, amount, error) {
  this.account1 = acc1;
  this.account2 = acc2;
  this.amount = amount;
  if (error !== undefined) {
    this.error = error;
  }

  this.transactionInfo = function () {
    const errorMessage = "error" in this ? ` error ${this.error}` : "";
    return (
      `Перевод со счета ${this.account1.iban} на ${this.account2.iban} на сумму ${this.amount}.` +
      errorMessage
    );
  };
}

const account1 = new Account("DE893788777343", "jack", 1000);
const account2 = new Account("FR893799777343", "ann", 1500);
const account3 = new Account("GB893790777343", "Petya", 700);
const account4 = new Account("IL893777677343", "Olga", 900);

//console.log(account1.getBalance());
//console.log(account1.withdraw("777"));

const accounts = [account1, account2, account3, account4];
function printAccounts(accounts) {
  console.log("====================Accounts====================");
  for (let i = 0; i < accounts.length; i++) {
    console.log(`Account ${i + 1}`);
    console.log(
      `   iban: ${accounts[i].iban} owner: ${accounts[i].owner} balance: ${accounts[i].getBalance()}`,
    );
    console.log("-----------------");
  }
}

printAccounts(accounts);

const transaction1 = transfer(account1, account2, 500);
console.log(transaction1.transactionInfo());
console.log(account1.getBalance(), account2.getBalance());

const transaction2 = transfer(account3, account1, 1000);
console.log(transaction2.transactionInfo());
console.log(account3.getBalance(), account1.getBalance());
console.log(transfer(account4, account2, -1000).transactionInfo());
console.log(transfer(account4, account2, NaN).transactionInfo());
console.log(transfer(account4, account2, "1000").transactionInfo());
