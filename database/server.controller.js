const codeInfoRepository = require('./repositories/CodeInfoRepository');

const controllerDatabase = async (req, res) => {
  const { repoList } = req.body;

  if (!repoList) {
    res.send({ errorMessage: 'Missing args' });
    return false;
  }

  const doc = await codeInfoRepository.find({ $or: repoList }, false);

  res.send({ data: doc });

  return true;
};

module.exports = controllerDatabase;
