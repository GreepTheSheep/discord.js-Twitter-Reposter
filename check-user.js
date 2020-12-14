const Discord = require('discord.js')

function checkUser(client, config, debug, twitter_client, old_avatar, old_count, old_name){
    setInterval(()=>{
        twitter_client.get('statuses/user_timeline', { screen_name: config.accounts[0].twitter_name }, (err, tweets) => {
            if (err) console.log(err)
    
            if (old_name && old_name === tweets[0].user.name) {
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] display name not changed`)
            }
    
            if (old_name && old_name !== tweets[0].user.name){
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] display name changed, setting in Discord...`)
                client.user.setUsername(tweets[0].user.name).catch(err=>{
                    if (debug === true) console.log(err)
                    client.user.setUsername(tweets[0].user.screen_name)
                })
                old_name = tweets[0].user.name
            }
    
            if (!old_name){
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_name not defined, setting var`)
                client.user.setUsername(tweets[0].user.name).catch(err=>{
                    console.log(err)
                    client.user.setUsername(tweets[0].user.screen_name)
                })
                old_name = tweets[0].user.name
            }
    
    
            if (old_count && old_count === tweets[0].user.followers_count) {
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] followers counter not changed`)
            }
    
            if (old_count && old_count !== tweets[0].user.followers_count){
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] followers counter changed, setting in Discord...`)
                client.user.setActivity(`${tweets[0].user.followers_count} followers`, { type: 'WATCHING' })
                old_count = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
            }
    
            if (!old_count){
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_counts not defined, setting var`)
                client.user.setActivity(`${tweets[0].user.followers_count} followers`, { type: 'WATCHING' })
                old_count = tweets[0].user.followers_count
            }
    
    
            if (old_avatar && old_avatar === tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")) {
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar not changed`)
            }
    
            if (old_avatar && old_avatar !== tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")){
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar changed, setting in Discord...`)
                client.user.setAvatar(tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")).catch(err=>{if (debug === true) console.log(`[${functiondate()} - ${functiontime()}] ${err}`)})
                old_avatar = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
            }
    
            if (!old_avatar){
                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_avatar not defined, setting var`)
                client.user.setAvatar(tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")).catch(err=>{if (debug === true) console.log(`[${functiondate()} - ${functiontime()}] ${err}`)})
                old_avatar = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
            }
    
        })
    }, 30*1000)
}

module.exports = checkUser