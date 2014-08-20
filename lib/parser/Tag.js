var Tag = function Tag(key, value) {
    this.key = key;
    this.value = value;
};

Tag.prototype.toString = function toString () {
    return '@' + this.key + '=' + this.value;
};

Tag.prototype.getKey = function getKey () {
    return this.key;
};

Tag.prototype.getValue = function getValue () {
    return this.value;
};