var Message = require(__dirname + '/Message.js');
var Tag = require(__dirname + '/Tag.js');

var Parser = function Parser(line) {
    this.message = new Message();
    this.line = line.replace('\r', '');
    this.space = 0;
    this.position = 0;

    this.message.string = this.line;
};

Parser.prototype.parse = function parse() {
    this._parseTags();
    this._trimWhitespace();
    this._parsePrefix();
    this._trimWhitespace();
    this._parseCommand();
    this._trimWhitespace();
    this._parseParams();

    return this.message;
};

Parser.prototype._parseTags = function parseTags() {
    if (this.line.charCodeAt(0) === 64) {
        var tags, tag, pair;

        this.space = this.line.indexOf(' ');
        if (this.space === -1) { return null; }

        tags = this.line.slice(1, this.space).split(';');
        for (var i=0; i < tags.length; i++) {
            tag = tags[i];
            pair = tag.split('='); // Although most tags have a value if they don't, assign true.
            this.message.tags.push(new Tag(pair[0], (pair[1] || true)));
        }

        this.position = this.space + 1;
    }
};

Parser.prototype._trimWhitespace = function trimWhitespace() {
    while (this.line.charCodeAt(this.position) === 32) {
        this.position++;
    }
};

Parser.prototype._parsePrefix = function parsePrefix() {
    if (this.line.charCodeAt(this.position) === 58) {
        this.space = this.line.indexOf(" ", this.position);
        if (this.space === -1) { return null; }

        this.message.prefix = this.line.slice(this.position + 1, this.space).replace(':', '');
        this.position = this.space + 1;

        while (this.line.charCodeAt(this.position) === 32) {
            this.position++;
        }
    }
};

Parser.prototype._parseCommand = function parsePrefix() {
    this.space = this.line.indexOf(" ", this.position);

    if (this.space === -1) {
        if (this.line.length > this.position) {
            this.message.command = this.line.slice(this.position);
        }
        return;
    }

    this.message.command = String(this.line.slice(this.position, this.space));
    this.position = this.space + 1;
};

Parser.prototype._parseParams = function parsePrefix() {
    while (this.position < this.line.length) {
        this.space = this.line.indexOf(" ", this.position);

        // Trailing!
        if (this.line.charCodeAt(this.position) === 58) {
            this.message.trailing = this.line.slice(this.position + 1);
            break;
        }

        // Keep looping!
        if (this.space !== -1) {
            this.message.params += " " + this.line.slice(this.position, this.space);
            this.position = this.space + 1;
            
            while (this.line.charCodeAt(this.position) === 32) {
                this.position++;
            }
            continue;
        }

        // We hit the end.
        if (this.space === -1) {
            this.message.params += " " + this.line.slice(this.position);
            break;
        }
    }

    this.message.params = this.message.params.trim();
};

// function parse(this.line) {
//     // Examples of IRCv3.2 messages:
//     //     @account=foo;intent=ACTION :foo!bar@baz.com PRIVMSG #foo :bar
//     //     :irc.server.com BATCH +yXNAbvnRHTRBv NETSPLIT *.net *.split
//     //     @batch=yXNAbvnRHTRBv;account=bar :bar!baz@foo.com QUIT :*.net *.split
//     //     :irc.server.com BATCH -yXNAbvnRHTRBv
//     var message, this.space, this.position;

//     message = new Message();

//     this.line = this.line.replace('\r', ''); // \r likes to be retained :/

//     message.string = this.line;

//     //
//     // TAGS
//     //
//     if (this.line.charCodeAt(0) === 64) {
//         var tags, tag, pair;

//         this.space = this.line.indexOf(' ');
//         if (this.space === -1) { return null; }

//         tags = this.line.slice(1, this.space).split(';');
//         for (var i=0; i < tags.length; i++) {
//             tag = tags[i];
//             pair = tag.split('='); // Although most tags have a value if they don't, assign true.
//             message.tags.push(new Tag(pair[0], (pair[1] || true)));
//         }

//         this.position = this.space + 1;
//     }

//     while (this.line.charCodeAt(this.position) === 32) {
//         this.position++;
//     }

//     //
//     // PREFIX
//     //
//     if (this.line.charCodeAt(this.position) === 58) {
//         this.space = this.line.indexOf(" ", this.position);
//         if (this.space === -1) { return null; }

//         message.prefix = this.line.slice(this.position + 1, this.space).replace(':', '');
//         this.position = this.space + 1;

//         while (this.line.charCodeAt(this.position) === 32) {
//             this.position++;
//         }
//     }

//     //
//     // COMMAND
//     //
//     this.space = this.line.indexOf(" ", this.position);

//     if (this.space === -1) {
//         if (this.line.length > this.position) {
//             message.command = this.line.slice(this.position);
//         }
//         return message;
//     }

//     message.command = String(this.line.slice(this.position, this.space));
//     this.position = this.space + 1;

//     // Skip any trailing whitethis.space.
//     while (this.line.charCodeAt(this.position) === 32) {
//         this.position++;
//     }

//     //
//     // PARAMS + TRAILING
//     //

//     while (this.position < this.line.length) {
//         this.space = this.line.indexOf(" ", this.position);

//         // Trailing!
//         if (this.line.charCodeAt(this.position) === 58) {
//             message.trailing = this.line.slice(this.position + 1);
//             break;
//         }

//         // Keep looping!
//         if (this.space !== -1) {
//             message.params += " " + this.line.slice(this.position, this.space);
//             this.position = this.space + 1;
            
//             while (this.line.charCodeAt(this.position) === 32) {
//                 this.position++;
//             }
//             continue;
//         }

//         // We hit the end.
//         if (this.space === -1) {
//             message.params += " " + this.line.slice(this.position);
//             break;
//         }
//     }

//     message.params = message.params.trim();
    
//     return message;
// }

module.exports = Parser;