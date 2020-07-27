'use strict';

const config = require("../../../config");

module.exports = {
    ...config,
    path: "/issues",
    filterClosedQS: "q=is%3Aissue+is%3Aclosed",
    filterOpenQS: "q=is%3Aissue+is%3Aopen"
}