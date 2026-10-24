// Módulos Externos
import inquirer from "inquirer";
import chalk from "chalk";

// Módulos Internos

import fs from "node:fs"

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