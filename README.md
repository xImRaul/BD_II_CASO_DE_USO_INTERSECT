Step by Step:
Generar la clave ssh
ssh-keygen -t rsa -b 4096 -C "lazaro.hernandez@uneatlantico.com"
Start the SSH agent in the background:
 eval "$(ssh-agent -s)"
Add Your SSH Key to the Agent
ssh-add ~/.ssh/id_rsa
Copy the SSH public key to your clipboard:
 cat ~/.ssh/id_rsa.pub 
Now, go to your GitHub account settings:
Go to Settings> SSH and GPG keys> New SSH key.Paste the SSH key into the key field and give it a recognizable title (like "Ubuntu VM"))
