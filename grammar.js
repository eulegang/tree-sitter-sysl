/**
 * @file A systems language
 * @author eulegang <eulegang@eulegang.dev>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "sysl",

  extras: ($) => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._top_level_decl),

    _top_level_decl: $ => choice(
      $.constant,
      $.variable,
      $.declaration,
    ),

    constant: $ => seq(
      'let',
      $.identifier,
      ':',
      $.type,
      '=',
      $._lit,
      ';'
    ),

    variable: $ => seq(
      'mut',
      $.identifier,
      ':',
      $.type,
      '=',
      $._lit,
      ';'
    ),

    declaration: $ => seq(
      $.identifier,
      '::',
      choice(
        $.namespace,
        $.struct,
      ),
    ),

    namespace: $ => seq(
      'namespace',

      optional(
        seq(
          '{',
          repeat($._top_level_decl),
          '}',
        ),
      ),
    ),

    struct: $ => seq(
      'struct',
      '{',
      repeat($._struct_part),
      '}',
    ),

    _struct_part: $ => choice(
      $.struct_field,
    ),

    struct_field: $ => seq(
      $.identifier,
      ':',
      $.type,
      ','
    ),

    identifier: $ => /[a-zA-Z_]+[a-zA-Z_0-9]/,

    type: $ => choice(
      $.int_type,
      $.bool_type,
      $.float_type,
      $.slice_type
    ),

    int_type: $ => /(i|u)(8|16|32|64)/,
    bool_type: $ => "bool",
    float_type: $ => /f(32|64)/,
    slice_type: $ => seq('[]', $.type),


    _lit: $ => choice(
      $.integer,
      $.bool,
      $.float,
    ),

    integer: $ => /[0-9]+/,
    bool: $ => /(true|false)/,
    float: $ => /[0-9]+\.[0-9]+/,

    comment: ($) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  }
});
