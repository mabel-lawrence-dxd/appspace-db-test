const Promise = require("bluebird");
const AppDAO = require("./dao");
const CardRpository = require("./card_repository");
const getCardInfo = require("./backend");

async function main() {
  const dao = new AppDAO("./appspace_cards_test.sqlite3");
  const cardRepo = new CardRpository(dao);

  const allInfo = await getCardInfo();

  // console.log(allInfo)

  await cardRepo
    .createTable()
    .then(() => cardRepo.clearRows())
    .then(() => cardRepo.resetIncrement());

  // Promise.all(
  allInfo.forEach(async (card) => {
    const { employeeName, headshot, description, yearEarned, quote } = card;
    console.log("EMPLOYEE NAME: ", employeeName);
    await cardRepo.create(
      employeeName,
      headshot,
      description,
      yearEarned,
      quote
    );
  });
  // );

  const allEmployees = await cardRepo.getEmployees();
  console.log(allEmployees);
  const art = await cardRepo.getByName('Art Gensler');
  console.log('Found Art Gensler: ',art);
}

main();
