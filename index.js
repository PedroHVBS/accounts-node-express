// Módulos Externos
import inquirer from "inquirer";
import chalk from "chalk";

// Módulos Internos

import fs from "node:fs"
import { getActiveResourcesInfo } from "node:process";

operation()

function operation() {
    inquirer
    .prompt([
        {
        type: "rawlist",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
            "Criar Conta",
            "Consultar Saldo",
            "Depositar",
            "Sacar",
            "Sair"
                ],
        },
    ])
    .then((answer) => {

        const action = answer['action']

        if (action === "Criar Conta"){
            createAccount()
        }

        else if (action === "Consultar Saldo"){
            pass
        }

        else if (action === "Depositar"){
            deposit()
        }

        else if (action === "Sacar"){
            pass
        }

        else if (action === "Sair"){
            console.log(chalk.bgBlue.black("Obrigado por utilizar o Accounts!"))
            process.exit()
        }

    })
    .catch((err) => console.log(err))
}

// Create an account

function createAccount(){
    console.log(chalk.green("Defina as opções da sua conta a seguir"))

    buildAccount()
}

function buildAccount(){
    inquirer.prompt([
        {
            name: "accountName",
            message: "Digite o nome para sua conta:"
        }
    ]).then(answer => {
        const accountName = answer["accountName"]

        console.info(accountName)

        if(!fs.existsSync("accounts")) { //Se pasta não existe, cria pasta 'accounts'
            fs.mkdirSync("accounts")
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){ //Se nome já existir em pasta 'accounts' impede criação e chama função novamente
            console.log(chalk.bgRed.black("Está conta já existe, escolha outro nome!"))
            buildAccount()
            return
        }

        fs.writeFileSync( //cria conta em pasta 'accounts'
            `accounts/${accountName}.json`,
            '{"balance": 0}', 
            function(err){
                console.log(err)
            },
        )

        console.log(chalk.green("Parabéns. Conta criada com sucesso!"))
        operation()


    })
    .catch(err => console.log(err))
}

// add an amount to user account

function deposit(){

    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da sua conta?"  
        }

    ]).then(answer => {

        const accountName = answer["accountName"]

        if (!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: "amount",
                message: "Digite o valor que deseja depositar:"

            }
        ]).then(answer => {
            const amount = answer["amount"]

            // add an amount
            addAmount(accountName, amount)

        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))

}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black("Essa conta não existe, tente novamente!"))
        return false
    }
     return true
}

function addAmount(accountName, amount){

    const accountData = getAccount(accountName)

    if (!amount){
        console.log(chalk.bgRed.black("Ocorreu um erro. Tente novamente mais tarde!"))
        return deposit()
    }

    amount = parseFloat(amount)
    if (amount <=0){
        console.log(chalk.bgRed.black("Ocorreu um erro. Tente novamente mais tarde!"))
    }
    else{
        accountData.balance = amount + parseFloat(accountData.balance)
        fs.writeFileSync(
            `accounts/${accountName}.json`,
            JSON.stringify(accountData),
            function (err){
                console.log(err)
            }
        )

        console.log(chalk.green(`Foi depositado o valor de R$ ${amount} com sucesso!`))
        operation()
    }

}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: "utf8",
        flag: "r"
    })

    return JSON.parse(accountJSON)
}