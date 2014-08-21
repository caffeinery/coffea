var Message = require(__dirname + '/Message.js');
var Tag = require(__dirname + '/Tag.js');

function parse(line) {
    // Examples of IRCv3.2 messages:
    //     @account=foo;intent=ACTION :foo!bar@baz.com PRIVMSG #foo :bar
    //     :irc.server.com BATCH +yXNAbvnRHTRBv NETSPLIT *.net *.split
    //     @batch=yXNAbvnRHTRBv;account=bar :bar!baz@foo.com QUIT :*.net *.split
    //     :irc.server.com BATCH -yXNAbvnRHTRBv
    var message, space, position;

    message = new Message();

    line = line.replace('\r', ''); // \r likes to be retained :/

    message.string = line;

    //
    // TAGS
    //
    if (line.charCodeAt(0) === 64) {
        var tags, tag, pair;

        space = line.indexOf(' ');
        if (space === -1) { return null; }

        tags = line.slice(1, space).split(';');
        for (var i=0; i < tags.length; i++) {
            tag = tags[i];
            pair = tag.split('='); // Although most tags have a value if they don't, assign true.
            message.tags.push(new Tag(pair[0], (pair[1] || true)));
        }

        position = space + 1;
    }

    while (line.charCodeAt(position) === 32) {
        position++;
    }

    //
    // PREFIX
    //
    if (line.charCodeAt(position) === 58) {
        space = line.indexOf(" ", position);
        if (space === -1) { return null; }

        message.prefix = line.slice(position + 1, space).replace(':', '');
        position = space + 1;

        while (line.charCodeAt(position) === 32) {
            position++;
        }
    }

    //
    // COMMAND
    //
    space = line.indexOf(" ", position);

    if (space === -1) {
        if (line.length > position) {
            message.command = line.slice(position);
        }
        return message;
    }

    message.command = String(line.slice(position, space));
    position = space + 1;

    // Skip any trailing whitespace.
    while (line.charCodeAt(position) === 32) {
        position++;
    }

    //
    // PARAMS + TRAILING
    //

    while (position < line.length) {
        space = line.indexOf(" ", position);

        // Trailing!
        if (line.charCodeAt(position) === 58) {
            message.trailing = line.slice(position + 1);
            break;
        }

        // Keep looping!
        if (space !== -1) {
            message.params += " " + line.slice(position, space);
            position = space + 1;
            
            while (line.charCodeAt(position) === 32) {
                position++;
            }
            continue;
        }

        // We hit the end.
        if (space === -1) {
            message.params += " " + line.slice(position);
            break;
        }
    }

    message.params = message.params.trim();
    
    return message;
}

module.exports.parse = parse;