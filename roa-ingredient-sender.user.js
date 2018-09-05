// ==UserScript==
// @name         Avabur Ingredient Sender
// @namespace    some_random_string_alujgfkadsglagfyuifgsidgf3
// @version      0.0.2
// @description  In game ui to build a iwire list
// @author       Batosi
// @match        https://*avabur.com/game*
// @downloadURL  https://github.com/Isotab/roa-ingredient-sender/raw/master/roa-ingredient-sender.user.js
// @updateURL    https://github.com/Isotab/roa-ingredient-sender/raw/master/roa-ingredient-sender.user.js
// @grant        none
// ==/UserScript==


(function($) {
    'use strict';

    let tableSelector = $("#inventoryOtherTable")

    let rebuildTable = (event, data) => {
        let ings = []
        $("#ingredient-wire-container").show() 

        if (!data.hasOwnProperty('result')) {
            return
        }
        setTimeout(() => {
            tableSelector.find("tr:gt(0)").remove()
            data.result.forEach((ingredient) => {
                if (ingredient.v <= 0) return

                let nameChanged = ingredient.n.replace(/ /g, '_')

                let row = `
                <tr>
                    <td data-th="Item">${ingredient.n}</td>
                    <td data-th="Amount">${ingredient.v}</td>
                    <td data-th="Actions">`

                
                if (ingredient.m) {
                    row = row + `<input class="ingredient-wire-input" data-max="${ingredient.v}" type="number" id="${nameChanged}" />
                        <button class="ingredient-wire-max-item" data-item="${nameChanged}" data-value="${ingredient.v}">Max</button>
                        <a class="marketIngredientLink" data-id="${ingredient.iid}" data-amount="${ingredient.v}">Market</a>
                        <a class="wireIngredientLink" data-id="${ingredient.iid}" data-amount="${ingredient.v}">Send</a>`
                }
                row = row + `</td>
                </tr>
                `
                tableSelector.append(row)
            })
        }, 100)
        $(document).one('roa-ws:page', (e, d) => { 
            $("#ingredient-wire-container").hide() 
            $("#ingredient-wire-results").html('')
        })
    }

    $(document).on('roa-ws:page:inventory_ingredients', rebuildTable)
    
    $("#itemWrapper").prepend(`
        <div id="ingredient-wire-container" style="display: none;">
            Wire To: <input id="ingredient-wire-to" class="can_autocomplete ui-autocomplete-input" autocomplete="off" type="text" /> 
            <button id="ingredient-wire-max-all" type="button">Max All</button> 
            <button id="ingredient-wire-send" type="button">Wire Ingredients</button>
            <div id="ingredient-wire-results"></div>
        </div>
    `)

    $(document).on('click', 'button.ingredient-wire-max-item', function(event) {
        $(this).parent().find('input.ingredient-wire-input').val($(this).attr('data-value'))
    })

    $(document).on('click', 'button#ingredient-wire-max-all', function(event) {
        tableSelector.find('input.ingredient-wire-input').each(function(i) {
            $(this).val($(this).attr('data-max'))
        })
    })

    $(document).on('click', 'button#ingredient-wire-send', function(event) {
        let itemsToSend = []
        tableSelector.find('input.ingredient-wire-input').each(function(i) {
            let v = parseInt($(this).val()) || 0
            let max = $(this).attr('data-max')

            if (v < 0) {
                return
            }
            if (v > max) {
                v = max
            }

            if (v > 0) {
                itemsToSend.push($(this).attr('id') + ' ' + v)
            }
        })
        if (itemsToSend.length === 0) {
            return
        }
        let wires = []
        while(itemsToSend.length > 0) {
            wires.push(itemsToSend.splice(0, 10))
        }
        console.log(wires)
        let to = $("#ingredient-wire-to").val()
        let i = 0
        wires.forEach((ingredients) => {
            // $("#ingredient-wire-results").append(`/iwire ${to} ${ingredients.join(', ')}<br />`)
            setTimeout(()=> {
                $("#chatMessage").html(`/iwire ${to} ${ingredients.join(', ')}`)
                $("#chatSendMessage").click()    
            }, ((i - 1) * 5500))
            i++

        })
    })

})(jQuery);

//$(document).one('roa-ws:page:inventory_ingredients', (e, data) => { console.log(data)})
