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

    await Promise.all(
      allInfo.map(async (card)=>{
        const { employeeName, headshot, description, yearEarned, quote } = card;
        await cardRepo.create(
          employeeName,
          headshot,
          description,
          yearEarned,
          quote
        );
      })
    )
    const results = await cardRepo.getEmployees();
    console.log('RESULTS \n',results);
  } catch (error) {
    console.error(error);
  }
}

main();

module.exports = resultRepo;
