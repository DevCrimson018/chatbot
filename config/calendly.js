const axios = require('axios');


async function getCurrentUser(){
    try {
        
        const calendlyApi = axios.create({
            baseURL: 'https://api.calendly.com',
            headers: {
                'Authorization': `Bearer ${process.env.CALENDLY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const response = await calendlyApi.get('/users/me');
        //console.log(response);
        return response.data.resource;
    } catch (error) {
        console.log('Error Obteniendo usuario:', error);
    }
}

async function getScheduledEvents(){

    const calendlyApi = axios.create({
            baseURL: 'https://api.calendly.com',
            headers: {
                'Authorization': `Bearer ${process.env.CALENDLY_TOKEN}`,
                'Content-Type': 'application/json'
            }
    });
    
    const user = await getCurrentUser();

    try {
        const response = await calendlyApi.get('/scheduled_events', {
            params: {user: user.uri, status: 'active'}
        })
        console.log(response.data.collection);
        return response.data.collection;
    } catch (error) {
        console.log('Error obteniendo eventos: ', error.response.data);
        
    }
}


module.exports = {getCurrentUser, getScheduledEvents}