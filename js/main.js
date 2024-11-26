// Gen Optinos
const length = document.getElementById("length");
const numbers = document.getElementById("numbers");
const characters = document.getElementById("characters");
const symbols = document.getElementById("symbols");
const uppercase = document.getElementById("uppercase");
const custom_import = document.getElementById("custom_import");
const custom_text = document.getElementById("custom_text");

// Pswd Result
const pswd_gen = document.getElementById("pswd_gen");
const pswd_result = document.getElementById("pswd_result");
const pswd_show = document.getElementById("pswd_show");

// Functions
const range_number = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const show_pswd = () => {
    pswd_result.setAttribute("type", pswd_show.checked ? "password" : "text");
}

const gen_options = () => {
    const custom_code = custom_import.value.trim().split(";");
    let blacklist = {start: [], end: []};
    let custom_cmd = "";
    custom_code.forEach(el => {
        const cmd = el.trim().split(":");
        switch (cmd[0]) {
            case "bl_start":
                blacklist.start.push(cmd[1].toString().trim())
                break
            case "bl_end":
                blacklist.end.push(cmd[1].toString().trim())
                break

            case "help":
            case "uс_first":
                custom_cmd = cmd[0];
                break
        }
    });

    return {
        ["length"]: +length.value.trim(),
        ["numbers"]: numbers.checked,
        ["characters"]: characters.checked,
        ["symbols"]: symbols.checked,
        ["uppercase"]: uppercase.checked,
        ["blacklist"]: blacklist,
        ["custom_cmd"]: custom_cmd,
    }
}

const create_pswd = () => {
    const options = gen_options();
    const numbers = "0123456789";
    const characters = "abcdefghijklmnopqrstuvwxyz";
    const symbols = "!@_./\\";
    const blacklist_start = options.blacklist.start.toString();
    const blacklist_end = options.blacklist.end.toString();

    let result = "";

    const check_blacklist = (char, it, max_it) => {
        return !((blacklist_start.indexOf(char) >= 0 && it == 1) || (blacklist_end.indexOf(char) >= 0 && it == max_it))
    }

    const check_cmd = () => {
        if (options.custom_cmd == "help") {
            window.open("../docs/documentation.html", '_blank').focus();
        }
    }

    check_cmd();

    console.log(blacklist_start);
    

    for (i = 1; i <= options.length; i++) {
        let added = false;
        if (options.characters && !added) {
            if (Math.random() >= 0.5) {
                const char = options.uppercase ? characters.charAt(range_number(0, characters.length)).toUpperCase() : characters.charAt(range_number(0, characters.length));
                if (check_blacklist(char, i, options.length)) {
                    added = true;
                    result += i == 1 && options.custom_cmd == "uс_first" ? char.toUpperCase() : char;
                }
                
            }
        }

        if (options.numbers && !added) {
            if (Math.random() >= 0.5) {
                const char = numbers.charAt(range_number(0, numbers.length)).toString();
                if (check_blacklist(char, i, options.length)) {
                    added = true;
                    result += char;
                }
            }
        }

        if (options.symbols && !added) {
            if (Math.random() >= 0.5) {
                const char = symbols.charAt(range_number(0, symbols.length)).toString();
                if (check_blacklist(char, i, options.length)) {
                    added = true;
                    result += char;
                }
            }
        }

        if (!added) {
            if (options.characters && !added) {
                const char = options.uppercase ? characters.charAt(range_number(0, characters.length)).toUpperCase() : characters.charAt(range_number(0, characters.length));
                while (!check_blacklist(char, i, options.length)) 
                    char = options.uppercase ? characters.charAt(range_number(0, characters.length)).toUpperCase() : characters.charAt(range_number(0, characters.length));
                    
                result += i == 1 && options.custom_cmd == "uс_first" ? char.toUpperCase() : char;
            } else if (options.numbers && !added) {
                const char = numbers.charAt(range_number(0, numbers.length)).toString();
                while (!check_blacklist(char, i, options.length))
                    char = numbers.charAt(range_number(0, numbers.length)).toString();

                result += char;
            } else if (options.symbols && !added) {
                if (Math.random() >= 0.5) {
                    const char = symbols.charAt(range_number(0, symbols.length)).toString();
                    while (!check_blacklist(char, i, options.length)) 
                        char = symbols.charAt(range_number(0, symbols.length)).toString();
                    result += char;
                }
            }
        }
    };

    return result
}

const gen_pswd = () => {
    const pswd = create_pswd();
    console.log(pswd, pswd.length);
    pswd_result.value = pswd;
}

const get_custom = () => {
    const code = custom_import.value.trim();
    custom_text.textContent = code;
}

// Connections
pswd_show.addEventListener("input", show_pswd);
pswd_gen.addEventListener("click", gen_pswd);
custom_import.addEventListener("input", get_custom);