#!/bin/zsh
# Main program loop with user options

echo "===Welcome to Hiccup246 development environment setup program==="

COLUMNS=12
PS3="Select item please: "

items=("Run entire mac setup" "Configure ssh keys" "Configure global git info" "Clone repos from github user")
start_loading_spinner
while true; do
    select item in "${items[@]}" Quit
    do
        case $REPLY in
            1)
                echo "Selected item #$REPLY which means $item";
                break
                ;;
            2) 
                chmod +x ssh-setup.sh && ./ssh-setup.sh               
                echo ""
                break
                ;;
            3) 
                echo ""
                chmod +x git-setup.sh && ./git-setup.sh
                break
                ;;
            4) 
                echo ""
                chmod +x github-setup.sh && ./github-setup.sh
                break
                ;;
            $((${#items[@]}+1)))
                echo "We're done!";
                break 2
                ;;
            *)
                echo "Ooops - unknown choice $REPLY";
                break
                ;
        esac
    done

    echo ""
done

# Loading spinner starter code
# Ispiration from https://unix.stackexchange.com/questions/225179/display-spinner-while-waiting-for-some-process-to-finish

LOADING_MESSAGE="Loading..."
export LOADING_MESSAGE

function cursorBack() {
  echo -en "\033[$1D"
}

start_loading_spinner_braille() {
    local spin='⣾⣽⣻⢿⡿⣟⣯⣷'
    local charwidth=1
    local i=0
    tput civis # cursor invisible
    
    while true; do
        local i=$(((i + $charwidth) % ${#spin}))
        printf  "\r${spin:$i:$charwidth} ${LOADING_MESSAGE}"
        cursorBack 1
        sleep .1
    done

    tput cnorm
}

start_loading_spinner() {
    spin='-\|/'
    message="yes"
    i=0

    while true; do
        i=$(( (i+1) %4 ))
        printf "\r${spin:$i:1} ${LOADING_MESSAGE}"
        sleep .1
        message="no"
    done
}