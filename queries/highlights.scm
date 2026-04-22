(identifier) @variable

["let" "mut"] @keyword

["namespace" "struct" "enum" "bitset"] @keyword.type
"return" @keyword.return

[
  "if"
  "else"
  "defer"

] @keyword.conditional

(self) @module


[
  "("
  ")"
  "{"
  "}"
] @punctuation.bracket

[";" "::" ","  ":" "->"] @punctuation.delimiter

["="] @operator


(integer) @number

(declaration (identifier) @function (function) )
(declaration (identifier) @module (namespace) )

(function (identifier) @variable.parameter)

[
 (int_type)
 (float_type)
 (bool_type)
 ] @type.builtin

(comment) @comment
