// variables 
let main = document.querySelector('main');
let refresh = document.querySelector('footer i');

// function to fetch forum info 

async function getData() {
    return await fetch('https://forum-proxy.freecodecamp.rocks/latest')
        .then((response) => response.json())
        .then((data) => data);
}

// When page loads 

document.addEventListener('DOMContentLoaded', async function(){
    let data = await getData();
    let rank = 0;
    data.topic_list.topics.forEach(topic => {
        let user = [];
        topic.posters.forEach((poster) => {
            user.push(data.users.find((user) => user.id == poster.user_id));
        });
        if(user.length > 3) {
            user = user.splice(0,2);
        }
        user.forEach((user) => {
            if(user.avatar_template.includes('https://freecodecamp.org/forum') || user.avatar_template.includes('https://t3.ftcdn.net/')){
                return
            } else if(user.avatar_template.includes('avatars.discourse-cdn.com')){
                user.avatar_template = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
            } else {
                user.avatar_template = `https://freecodecamp.org/forum${user.avatar_template.replace('{size}', 135)}`;
            }
        });

        rank++;
        
        let time = ((new Date() - new Date(topic.bumped_at))/1000)/60;

        if(time >= 60){
            time = `${Math.round(time/60)}h`
        } else if (time < .6){
            time = `${parseInt(Math.round(time * 100))}s`
        } else {
            time = `${Math.round(time)}m`
        }



        let html = `
            <div class='row wrapper'>
                <h1 class='rank split col-sm-2 col-lg-1 '>#${rank}</h1>
                <a class='title split col-sm-10 col-lg-4' target="_blank" href='https://forum.freecodecamp.org/t/${topic.slug}'>${topic.title}</a>
                <div class='split user-pics col-sm-12 col-lg-3'>

        `
        user.forEach((user) => {
            html += `
                    <a href='https://www.freecodecamp.org/forum/u/${user.username}' target="_blank" ><img class='users' src='${user.avatar_template}'/></a>
            `
        });

        html += `
                </div>
                <p class='replies split col-sm-4 col-lg-1'>${topic.reply_count}</p>
                <p class='views split col-sm-4 col-lg-1'>${topic.views}</p>
                <p class='time split col-sm-4 col-lg-2'>${time}</p>
            </div>
        `
        main.innerHTML += html;
    });
});

// Refresh page 

refresh.addEventListener('click', function(){
    history.go(0);
})