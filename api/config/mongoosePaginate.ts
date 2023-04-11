// tslint:disable-next-line: no-var-requires
const mongoosePaginate = require('mongoose-paginate-v2');

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 10
};
