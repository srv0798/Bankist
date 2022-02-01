'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Functions

const displayTransaction = function (acc, sort = false, sortingOrder = 'desc') {
  //console.log(movement.slice());
  //sort
  let sortedMovement;
  if (sort) {
    if (sortingOrder === 'desc') {
      sortedMovement = acc.movements.slice().sort((a, b) => a - b);
    } else {
      sortedMovement = acc.movements.slice().sort((a, b) => b - a);
    }
  } else {
    sortedMovement = acc.movements;
  }
  // const sortedMovement = sort
  //   ? movement.slice().sort((a, b) => a - b)
  //   : movement;
  //displaydate
  //console.log(sortedMovement);
  containerMovements.innerHTML = '';
  sortedMovement.forEach((mov, i) => {
    const dateNow = new Date(acc.movementsDates[i]);
    // const date = `${dateNow.getDate()}`.padStart(2, 0);
    // const month = `${dateNow.getMonth() + 1}`.padStart(2, 0);
    // const year = dateNow.getFullYear();
    const displayDate = new Intl.DateTimeFormat();

    const movementType = mov > 0 ? 'deposit' : 'withdrawal';

    const fMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${movementType}">${
      i + 1
    }        ${movementType}</div>
    <div class="movements__date">${new Intl.DateTimeFormat(acc.locale).format(
      dateNow
    )}</div>
    <div class="movements__value">${fMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const startLogoutTimer = function () {
  const tick = function () {
    let minute = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minute} : ${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent =
        'You have been logged out! Please log in again ';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//displayTransaction(account1.movements);

const displaySummary = function (ac) {
  //console.log(ac.movements);
  const sumIn = ac.movements.filter(a => a > 0).reduce((a, c) => a + c, 0);
  labelSumIn.textContent = new Intl.NumberFormat(ac.locale, {
    style: 'currency',
    currency: ac.currency,
  }).format(sumIn);

  const sumOut = Math.abs(
    ac.movements.filter(a => a < 0).reduce((a, c) => a + c, 0)
  );
  labelSumOut.textContent = new Intl.NumberFormat(ac.locale, {
    style: 'currency',
    currency: ac.currency,
  }).format(sumOut);

  const interest = ac.movements
    .filter(a => a > 0)
    .map(d => (d * Number(ac.interestRate)) / 100)
    .reduce((a, c) => a + c, 0)
    .toFixed(2);
  labelSumInterest.textContent = new Intl.NumberFormat(ac.locale, {
    style: 'currency',
    currency: ac.currency,
  }).format(interest);
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((a, c) => a + c, 0);

  labelBalance.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance);
  //console.log(acc);
};
const createUserName = function (accs) {
  accs.forEach(
    acc =>
      (acc.userName = acc.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
};

const updateUI = function (a) {
  displayTransaction(a);
  displaySummary(a);
  displayBalance(a);
};

//const name = 'Steven Thomas Williams';
/* const calculateuserName = function (name) {
  let userName = name
    .toLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');
  console.log(userName);
}; */

//calculateuserName('Steven Thomas Williams');

createUserName(accounts);
//console.log(accounts);

//Post Login events
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    const nowDate = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'short',
    };

    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(nowDate);

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
  }
});

// //Fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Transfer Money Event
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const transfereeAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  // console.log(
  //   transferAmount,
  //   currentAccount.balance,
  //   transfereeAccount.userName
  // );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
  if (
    transferAmount > 0 &&
    transfereeAccount &&
    transferAmount <= currentAccount.balance &&
    transfereeAccount.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-transferAmount);
    transfereeAccount.movements.push(transferAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transfereeAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  //console.log(transfereeAccount);
  clearInterval(timer);
  timer = startLogoutTimer();
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(a => a >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogoutTimer();
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  //console.log();
  if (
    currentAccount?.userName === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === inputCloseUsername.value
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
let sortFlag = false,
  sortingOrder = 'desc';
btnSort.addEventListener('click', e => {
  e.preventDefault();
  //displayTransaction(currentAccount.movements, !sortFlag);
  //sortFlag = !sortFlag;
  //console.log(sortFlag, sortingOrder);
  if (sortFlag) {
    displayTransaction(currentAccount, false);
    sortFlag = false;
    sortingOrder = 'desc';
  } else {
    if (sortFlag === false && sortingOrder === 'desc') {
      //console.log('Test');
      displayTransaction(currentAccount, true);
      sortFlag = false;
      sortingOrder = 'asc';
    } else if (sortFlag === false && sortingOrder === 'asc') {
      displayTransaction(currentAccount, true, 'asc');
      sortFlag = true;
      sortingOrder = '';
    }
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// setInterval(() => {
//   console.log(
//     new Intl.DateTimeFormat('en-IN', {
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//     }).format(new Date())
//   );
// }, 1000);
