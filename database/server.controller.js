const dbCode = require('./repositories/CodeInfoRepository');

const controllerDatabase = async (req, res) => {
  const { repoList } = req.body;

  if (!repoList) {
    res.send({ errorMessage: 'Missing args' });
    return false;
  }

  const doc = await dbCode.find({ $or: repoList }, false);

  res.send({ data: doc });
};

module.exports = controllerDatabase;
