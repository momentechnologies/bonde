#!/bin/bash

cd "$(dirname "$0")"

default_ip="127.0.0.1"
ip=${1:-$default_ip}

read -r -d '' hosts << EOM
$ip\tapi.local.kaalrota.no
$ip\tfrontend.local.kaalrota.no
$ip\tlocal.kaalrota.no
EOM

replaceStringWithoutNewline=${hosts//$'\n'/\\n}
echo $replaceStringWithoutNewline
sudo ./manage-block-in-file.sh /etc/hosts "$replaceStringWithoutNewline"