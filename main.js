const Promise = require("bluebird");
const AppDAO = require("./dao");
const CardRpository = require("./card_repository");
const getCardInfo = require("./backend");

let resultRepo;

async function main() {
  const dao = new AppDAO("./appspace_cards_test.sqlite3");
  const cardRepo = new CardRpository(dao);

  try {
    const allInfo = await getCardInfo();

    // console.log(allInfo)

    await cardRepo
      .createTable()
      .then(() => cardRepo.clearRows())
      .then(() => cardRepo.resetIncrement());

    // Promise.all(
    allInfo.forEach(async (card) => {
      try {
        const { employeeName, headshot, description, yearEarned, quote } = card;
        console.log("EMPLOYEE NAME: ", employeeName);
        await cardRepo.create(
          employeeName,
          headshot,
          description,
          yearEarned,
          quote
        );
      } catch (error) {
        console.error(error);
      }
    });
    // );

    setTimeout(async ()=>{
      const allEmployees = await cardRepo.getEmployees();
      console.log('ALL EMPLOYEES \n',allEmployees);
    },1)
    // const art = await cardRepo.getByName('Art Gensler');
    // console.log('Found Art Gensler: ',art);
    // const results = await cardRepo.getEmployees();
    // console.log('RESULTS \n',results);
    // return cardRepo;
  } catch (error) {
    console.error(error);
  }
}

main();

module.exports = resultRepo;
