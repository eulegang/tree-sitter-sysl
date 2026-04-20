
["let" "mut" "namespace" "struct"] @keyword

(identifier) @variable

["::" ","  ":"] @punctuation

["{" "}"] @punctuation.bracket

[
 (int_type)
 (float_type)
 (bool_type)
 (slice_type)
 ] @type

