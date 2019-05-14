const fs = require("fs");

class charFile {
    constructor(name, extension, content = "") {
        this.name = name;
        this.extension = extension;
        this.content = content;
    };
    /**
     * Save the file to the desired path
     * @param {String} path 
     */
    save(path) {
        fs.writeFileSync(path + this.name + this.extension, this.content);
    };
    /**
     * Change the data content of a file
     * @param {String} content 
     */
    setContent(content = "") {
        this.content = content;
    };
    /**
     * Check if the file exists
     * @param {String} path 
     */
    exist(path) {
        return fs.existsSync(path + this.name + this.extension);
    };
    /**
     * Open a file and fill the content with that file
     * @param {String} path 
     */
    open(path) {
        this.content = fs.readFileSync(path + this.name + this.extension, "UTF-8");
    };
    /**
     * Open a file and fille the content with a JSON parse of that content
     * @param {String} path 
     */
    openJSon(path) {
        this.open(path);
        this.content = JSON.parse(this.content);
    };
};

module.exports.charFile = charFile;