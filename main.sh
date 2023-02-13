#!/bin/zsh
# Main program loop with user options

echo "===Welcome to Hiccup246 development environment setup program==="
echo "What do you want to do?"

PS3="Select item please: "

items=("Item 1" "Item 2" "Item 3")

while true; do
    select item in "${items[@]}" Quit
    do
        case $REPLY in
            1) echo "Selected item #$REPLY which means $item"; break;;
            2) echo "Selected item #$REPLY which means $item"; break;;
            3) echo "Selected item #$REPLY which means $item"; break;;
            $((${#items[@]}+1))) echo "We're done!"; break 2;;
            *) echo "Ooops - unknown choice $REPLY"; break;
        esac
    done
done