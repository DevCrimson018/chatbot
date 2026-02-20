const axios = require('axios');


async function getCurrentUser(calendlyApi){
    try {

        const response = await calendlyApi.get('/users/me');
        console.log(response.data.resource);
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
    
    const user = await getCurrentUser(calendlyApi);

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

get

async function generateSchedulingLink(){
    try {
        const calendlyApi = axios.create({
                baseURL: 'https://api.calendly.com',
                headers: {
                    'Authorization': `Bearer ${process.env.CALENDLY_TOKEN}`,
                    'Content-Type': 'application/json'
                }
        });

        const user = await getCurrentUser(calendlyApi);

        const res = await axios.post(
            'https://api.calendly.com/scheduling_links',
            {
                max_event_count: 1,
                owner: `https://api.calendly.com/event_types/${user.uri}`,
                owner_type: "EventType"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        )
        console.log('Aqui esta el link');
        console.log(res);
        return res;
        
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {getCurrentUser, getScheduledEvents, generateSchedulingLink}