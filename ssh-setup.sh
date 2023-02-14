#!/bin/zsh
# Generate ssh keys for github global user name
# Inspiration taken from https://gist.github.com/jexchan/2351996 and https://gist.github.com/oanhnn/80a89405ab9023894df7

setup_global_ssh_key() {
	echo ""

	if [[ ! $(git config --global user.email) ]]; then
		echo "No global git email found, please set one"
		return
	fi

	read 'ssh_file_name?Enter desired filename of your ssh key: '

	# Generate the ssh key using the captured filename and global git email
	cd ~/.ssh
	ssh-keygen -t rsa -C $(git config --global user.email) -f "$ssh_file_name"
	echo "Ssh key generated and saved in ~/.ssh/"

	pbcopy < "${ssh_file_name}.pub"
	echo "Copied generated ssh key to clipboard"

	# Setup ssh config file
	touch ~/.ssh/config

	echo "\nHost github.com" >> config
	echo "\tHostName github.com" >> config
	echo "\tIdentityFile ~/.ssh/${ssh_file_name}" >> config
	echo "\tIdentitiesOnly yes" >> config

	cd -

	ssh-add ~/.ssh/${ssh_file_name}
	echo "Ssh key saved to ssh agent"
	echo "Global ssh key setup successfully!"
}

setup_local_ssh_key() {
	echo ""

	if [[ ! $(git config --local user.email) ]]; then
		echo "No local git user email found, please set one"

		if [[ ! $(git config --local user.name) ]]; then
			echo "No local git user name found, please set one"
		fi

		return
	fi

	git_user_email=$(git config --local user.email)
	git_user_name=$(git config --local user.name)

	read 'ssh_file_name?Enter desired filename of your ssh key: '

	# Generate the ssh key using the captured filename and local git email
	cd ~/.ssh
	ssh-keygen -t rsa -C ${git_user_email} -f "$ssh_file_name"
	echo "Ssh key generated and saved in ~/.ssh/"

	pbcopy < "${ssh_file_name}.pub"
	echo "Copied generated ssh key to clipboard"

	# Setup ssh config file
	touch ~/.ssh/config

	echo "\nHost github.com-${git_user_name}" >> config
	echo "\tHostName github.com" >> config
	echo "\tIdentityFile ~/.ssh/${ssh_file_name}" >> config
	echo "\tIdentitiesOnly yes" >> config

	cd -

	ssh-add ~/.ssh/${ssh_file_name}
	echo "Ssh key saved to ssh agent"
	echo "Local ssh key setup successfully!"
}

# Setup global ssh key
# Capture user ssh key filename
echo "Time to configure ssh keys"
read -q '?Do you want to configure a global ssh key using global git info? [y/n] '
answer=$?

if ((!$answer)); then
	setup_global_ssh_key
fi

echo ""
read -q '?Do you want to configure a local ssh key using local git info? [y/n] '
answer=$?

if ((!$answer)); then
	setup_local_ssh_key
fi

echo ""
echo "No other ssh options available"
