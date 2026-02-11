//makes the list of users
const users = {};

//will be used to respond to the json object
const respondData = (request, response, status, object) => {
    const content = JSON.stringify(object);

    //build the header makes sure it is the correct inputs and stuff
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };

    response.writeHead(status, headers);

    //if it isn't a head response it will write out the content
    //in the response
    if(request.method !== "HEAD" && status !== 204){
        response.write(content);
    }

    response.end();
}

//returns the user object
const getUsers = (request, response) =>{
    const responseJSON = {
        users,
    };
    return respondData(request, response, 200, responseJSON);
};

const addUser = (request, response) => {
    //makes a default json message in case the fields are not added
    const responseJSON = {
        message: 'Name and age are both required.',
    };

    //grabs the name and age out of the request's body
    //if one of them is missing it will be set to undefined
    const { name, age } = request.data;

    //if either one is missing we will throw a 400 error message
    if(!name || !age){
        responseJSON.id = 'missingParams';
        return respondData(request, response, 400, responseJSON);
    };

    //default status code to 204 for updated
    let responseCode = 204

    //if the user doesn't exist yet we set
    //the status code to 201(created) and create an empty user
    if(!users[name]){
        responseCode = 201;
        users[name] = {
            name: name,
        };
    }

      users[name].age = age;

      if(responseCode === 201){
        responseJSON.message = 'Created Successfully';
        return respondData(request, response, responseCode, responseJSON);
      }
    
    return respondData(request,response, 201, {});
}


//gives out the message if the page isn't found
const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    respondData(request, response, 404, responseJSON);
};

module.exports = {
    getUsers,
    addUser,
    notFound,
};