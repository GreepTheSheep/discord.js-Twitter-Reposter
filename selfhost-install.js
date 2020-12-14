const shell = require('shelljs');
const prompt = require('prompt');
const colors = require("colors/safe");
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const os = require('os');
const package = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const request = require('request')

console.log('\033[2J');

title()

async function title() {
    console.log('┌─────────────────────────────────┐')
    console.log('│         ' + colors.bold(colors.rainbow('Twitter Reposter')) + '        │')
    console.log('│                                 │')
    console.log('│       Selfhost installation     │')
    console.log('│             By Greep            │')
    console.log('└─────────────────────────────────┘')
    console.log(colors.grey(package.repository.url))
    check_commands();
}

async function check_commands(){
    console.log('')

    // Check commands

    console.log('# Checking if git is installed...')
    await wait(2000)
    shell.exec('git --version',{silent: true}, function(code, stdout, stderr){
        if (code != 0){
            console.error(colors.red('----- ERROR: ------'))
            console.error('Git is not installed')
            if (os.type() == 'Linux') {
                console.error('Trying to installing it for you...')
                shell.exec('apt install -y git',{silent: false}, function(code, stdout, stderr){
                    if (code != 0){
                        console.error(colors.red('Unable to install git'))
                        console.error(stderr)
                        console.error('please install git:' + colors.bold('apt install -y git'))
                        console.error(colors.red('-------------------'))
                        process.exit(2)
                    } else {
                        console.log(colors.green('Git succefully installed!'))
                        config()
                    }
                })
            } else {
            if (os.type() == 'Windows_NT') console.error('please install git at https://git-scm.com/download/win')
            else console.error(colors.bold('please install git'))
            console.error('And retry the installation after')
            console.error(colors.red('-------------------'))
            process.exit(2)
            }
        } else {
            console.log(colors.green('Git is installed!') + ' Version: ' + stdout.replace('git version ', ''))
            config()
        }
    })
}

async function config(){
    console.log('\n# Creating configuration:')
    await wait(1000);

    fs.access('./config.json', fs.constants.F_OK, (err) => {
        if (!err) {
            console.log(colors.yellow(`Config file exists!`) + colors.cyan(' recreating the file'));
        }
        fs.writeFileSync('./config.json', fs.existsSync('./config.example.json') ? fs.readFileSync('./config.example.json') : '')
        var array = {};
    });

    await wait(1000);

    var schema = {
        properties: {
          token: {
            description: colors.white(colors.underline('Enter your Discord bot token') + colors.grey(' (https://discordapp.com/developers):')),
            type: 'string',
            required: true,
            message: colors.red('Please enter your Discord bot token')
          },
          consumer_key: {
            description: colors.white(colors.underline('Enter your Twitter Consumer key') + colors.grey(' (https://developer.twitter.com/en/apps):')),
            type: 'string',
            required: true,
            message: colors.red('Please enter your Twitter Consumer key')
          },
          consumer_secret: {
            description: colors.white(colors.underline('Enter your Twitter Consumer secret') + colors.grey(' (https://developer.twitter.com/en/apps):')),
            type: 'string',
            required: true,
            message: colors.red('Please enter your Twitter Consumer secret')
          },
          access_token_key: {
            description: colors.white(colors.underline('Enter your Twitter Access token key') + colors.grey(' (https://developer.twitter.com/en/apps):')),
            type: 'string',
            required: true,
            message: colors.red('Please enter your Twitter Access token key')
          },
          access_token_secret: {
            description: colors.white(colors.underline('Enter your Twitter Access token secret') + colors.grey(' (https://developer.twitter.com/en/apps):')),
            type: 'string',
            required: true,
            message: colors.red('Please enter your Twitter Access token secret')
          },
          twitter_name: {
            description: colors.white(colors.underline('Please enter your Twitter account name')),
            type: 'string',
            default: '@GreepTheSheep',
            required: true,
            message: colors.red('Please enter your Twitter account name')
          },
          owner_id: {
            description: colors.white(colors.underline('Enter your User ID')),
            pattern: /^[0-9]+$/,
            type: 'string',
            required: true,
            message: colors.red('Please enter your User ID')
          },
          channel_id: {
            description: colors.white(colors.underline('Enter the Channel ID where I repost your tweets: ')),
            pattern: /^[0-9]+$/,
            type: 'string',
            required: true,
            message: colors.red('Please enter your Channel ID')
          },
          retweet: {
            description: colors.white(colors.underline('Do you want to repost your retweets?') + ' (yes/no):'),
            type: 'string',
            pattern: /^\w+$/,
            default: 'yes',
            required: true
          },
          reply: {
            description: colors.white(colors.underline('Do you want to repost your replies?') + ' (yes/no):'),
            type: 'string',
            pattern: /^\w+$/,
            default: 'no',
            required: true
          },
        }
    };
    prompt.message = '';
    prompt.delimiter = '';
    prompt.start();
    prompt.get(schema, function (err, result) {
        var rt = true
        if (result.retweet.toLowerCase().includes('no')) rt = false
        var rp = false
        if (result.reply.toLowerCase().includes('yes')) rp = true
        array = {
            "channel_id": result.channel_id,
            "verbose": false,
            "retweet": rt,
            "reply": rp,
            "owner_id": result.owner_id,
            "discord_token" : result.token,
            "twitter_name": result.twitter_name.replace('@', ''),
            "consumer_key": result.consumer_key,
            "consumer_secret": result.consumer_secret,
            "access_token_key": result.access_token_key,
            "access_token_secret": result.access_token_secret
        };
        var array_file = JSON.stringify(array).split(',').join(',\n    ')
        array_file = array_file.replace('{', '{\n    ').replace('}', '\n}')
        fs.writeFile('./config.json', array_file, async function(x){
            if (x) {
                console.error(colors.red('----- ERROR: ------'))
                console.error(`We\'re unable to create config data`)
                console.error('Details:')
                console.error(x)
                console.error(colors.red('-------------------'))
                process.exit(11)
            } else {
                console.log(colors.green('Sucess!'))
                end()
            }
        });
    });
}

async function end(){
    await wait(2000)

    console.log('\n')
    console.log(colors.rainbow('┌─────────────────────────────────┐'))
    console.log(colors.rainbow('|            ✅ Done! ✅          |'))
    console.log(colors.rainbow('└─────────────────────────────────┘'))
    console.log('')
    console.log('Installation finished! Thanks for your patience')

    console.log('You can start the script using pm2: ' + colors.blue('pm2 start ecosystem.config.js'))
    console.log('or just with node: ' + colors.blue('node index.js'))
    console.log(colors.green('\nThanks for using Twitter Reposter 💙'))
    console.log('')
    process.exit(0)
}
