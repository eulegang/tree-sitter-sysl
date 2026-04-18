
["let" "mut" "namespace" "struct"] @keyword

(identifier) @tag

["::" ","  ":"] @punctuation

["{" "}"] @punctuation.bracket

[
 (int_type)
 (float_type)
 (bool_type)
 (slice_type)
 ] @type

