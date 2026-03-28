

           /*   
            *  -||||||||||||||||||||||||||||||||||||||-
            * ---========================================---
            * ---========================================---
            * ---== START OF CUSTOM DROPDOWN "LIBRARY" ==---
            * ---========================================---
            * ---========================================---
            *   -||||||||||||||||||||||||||||||||||||||-
            */  
            
            
           document.addEventListener("DOMContentLoaded", () => {


            document.querySelectorAll('.dropdown').forEach(btn => {
                let ul = btn.nextElementSibling;

                let ulDisplay = 'block'

                let showOp = ul.firstElementChild;
                showOp.classList.add("hiddenDropdownOp")

                btn.textContent = showOp.textContent
                btn.setAttribute('data-selected', btn.textContent)

                btn.addEventListener("click", () => {
                    

                    if (ul.classList.contains('selectedDrop')) {
                        ul.classList.remove('selectedDrop')
                        btn.classList.remove('open')
                    } else if (!ul.classList.contains('selectedDrop')) {
                        document.querySelector('.selectedDrop')?.classList.remove('selectedDrop')
                        document.querySelector('.open')?.classList.remove('open')

                        ul.classList.add('selectedDrop')
                        btn.classList.add('open')
                        
                    }

                    //ul.classList.toggle('selectedDrop')



                })

               Array.from(ul.children).forEach (li => {

                    li.addEventListener("click", () => {
                        //remove hidden from all
                        Array.from(ul.children).forEach(li => {
                            li.classList.remove('hiddenDropdownOp')
                        })
                        li.classList.add('hiddenDropdownOp')
                        btn.textContent = li.textContent

                        ul.classList.remove('selectedDrop')
                        btn.classList.remove('open')
                        btn.setAttribute('data-selected', li.textContent)
                    })

                })
                

            });

            let observer = new MutationObserver((mutations) => {
                
                for (const mutation of mutations) {
                    let value = mutation.target.getAttribute("data-selected")
                    let btn = mutation.target
                    try {
                    mutation.target.dispatchEvent(new CustomEvent("change", {"bubbles": true, "detail": value}))                        

                     btn.textContent = value
                    let ul = btn.nextElementSibling
                    Array.from(ul.children).forEach(li => {
                        
                        if (li.textContent == value) {

                            Array.from(ul.children).forEach(li => {
                                li.classList.remove('hiddenDropdownOp')
                    })

                    li.classList.add('hiddenDropdownOp')
                            
                        }

                    })

                    } catch(e) {
                         e = e.toString()

                        if (e.includes('ReferenceError') && e.includes('is not defined')) {
                console.warn(`
                --- DROPDOWN ERROR ---
                
                DEFINE dropDownChanged() function
                OR alternitavely just add an event listiner, "change", to the dropdown

                Use the parameters inputed, the dropdown element, and value that it changed to for the dropdown that changed, and the value it changed to
                
                eg;

                function dropDownChanged(drop, val) {
                     console.log(drop, val)
                }
                `)
                        } else {
                            console.error(e)
                        }



                    }

                }

            })

            function activateDropdowns() {
            
                const buttons = document.querySelectorAll('.dropdown')
            
            buttons.forEach(el => {
                
                observer.observe(el, {
                attributes: true,
                attributeFilter: ["data-selected"]
            })

            })
            }
            activateDropdowns()
                
            function closeAllDrops() {
                document.querySelectorAll('.dropdown').forEach(btn => {
                    let ul = btn.nextElementSibling

                    btn.classList.remove('open')
                    ul.classList.remove('selectedDrop')

                    
                })
            }

            document.addEventListener("click", (e) => {
                if (e.target.closest('.dropdown') || e.target.closest('dropdown-options')) return

                closeAllDrops()
            });


                        console.log(`
            --DROPDOWN 1.0--
        Thanks you for using this
               :USAGE:
            
--------------------------------------

 <button class="dropdown">
    </button>
    <ul class="dropdown-options">
        <li>option one</li>
        <li>option twp</li>
        <li>option three</li>
        <li>option four</li>
    </ul>
--------------------------------------

    Read value on the dropdown, or add an event listiner, and read event.detail from the event
            `)








           });




    let dropLib = {
            setDropdown: function (dropdown, value) {


                let AllDropOps = dropdown.nextElementSibling.querySelectorAll("li")
                let Li2Click;
                Array.from(AllDropOps).forEach(el => {
                    if (el.textContent == value) Li2Click = el
                })

                if (!Li2Click) {
                    console.warn(`\n ---Dropdown--Error---\n \n Could not find option to set dropdown to, 
                        
dropdown
                        
-------
                        `, 
                        dropdown, `

                        \n \n dropdown 1.0`) //cooked syntax
                    return
                }

                Li2Click.click()
            }
        }


           /*   
            *  -||||||||||||||||||||||||||||||||||||||-
            * ---======================================---
            * ---======================================---
            * ---== END OF CUSTOM DROPDOWN "LIBRARY" ==---
            * ---======================================---
            * ---======================================---
            *   -||||||||||||||||||||||||||||||||||||||-
            */  

        