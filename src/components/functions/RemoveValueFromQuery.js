
class QueryFunction {

    queryStringToObject(queryString) {
        const params = new URLSearchParams(queryString);
        const queryObject = {};

        for (const [key, value] of params.entries()) {
            queryObject[key] = value;
        }

        return queryObject;
    };

    cancelAction(path, parameters) {

        const url = new URL(window.location);
        const params = new URLSearchParams(url.search);

        for (let param of parameters) {
            params.delete(param)
        }

        const newQuery = this.queryStringToObject(params.toString())

        return newQuery
    }
}



export default new QueryFunction();
