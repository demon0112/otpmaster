// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDeclaration, XMLNode, isObject;

  ({isObject} = require('./Utility'));

  XMLNode = require('./XMLNode');

  NodeType = require('./NodeType');

  // Represents the XML declaration
  module.exports = XMLDeclaration = class XMLDeclaration extends XMLNode {
    // Initializes a new instance of `XMLDeclaration`

    // `parent` the document object

    // `version` A version number string, e.g. 1.0
    // `encoding` Encoding declaration, e.g. UTF-8
    // `standalone` standalone document declaration: true or false
    constructor(parent, version, encoding, standalone) {
      super(parent);
      // arguments may also be passed as an object
      if (isObject(version)) {
        ({version, encoding, standalone} = version);
      }
      if (!version) {
        version = '1.0';
      }
      this.type = NodeType.Declaration;
      this.version = this.stringify.xmlVersion(version);
      if (encoding != null) {
        this.encoding = this.stringify.xmlEncoding(encoding);
      }
      if (standalone != null) {
        this.standalone = this.stringify.xmlStandalone(standalone);
      }
    }

    // Converts to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
    }

  };

}).call(this);
