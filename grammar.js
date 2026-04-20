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
      $._type,
      '=',
      $._lit,
      ';'
    ),

    variable: $ => seq(
      'mut',
      $.identifier,
      ':',
      $._type,
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
        $.enum,
        $.bitset,
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

    bitset: $ => seq(
      'bitset',
      optional(seq('(', $.int_type, ')')),
      '{',
      repeat($._bitset_part),
      '}'
    ),

    _bitset_part: $ => choice(
      $.method,
      $.function,
      $.bitset_bit,
    ),

    bitset_bit: $ => seq(
      $.identifier,
      optional(seq(
        '=',
        $._lit,
      )),
      ',',
    ),

    enum: $ => seq(
      'enum',
      optional(seq('(', $.int_type, ')')),
      '{',
      repeat($._enum_part),
      '}',
    ),

    _enum_part: $ => choice(
      $.enum_variant,
      $.method,
      $.function
    ),

    enum_variant: $ => seq($.identifier, optional(seq('=', $._lit)), ","),


    struct: $ => seq(
      'struct',
      '{',
      repeat($._struct_part),
      '}',
    ),

    _struct_part: $ => choice(
      $.struct_field,
      $.method,
      $.function,
    ),

    struct_field: $ => seq(
      $.identifier,
      ':',
      $._type,
      ','
    ),

    method: $ => seq(
      $.identifier,
      '::',
      $._method_sig,
      '{',
      '}'
    ),

    function: $ => seq(
      $.identifier,
      '::',
      $._function_sig,
      '{',
      '}'
    ),


    identifier: $ => /[a-zA-Z_][a-zA-Z_0-9]*/,

    _type: $ => choice(
      $.int_type,
      $.bool_type,
      $.float_type,
      $.slice_type
    ),

    int_type: $ => /(i|u)(8|16|32|64)/,
    bool_type: $ => "bool",
    float_type: $ => /f(32|64)/,
    slice_type: $ => seq('[]', $._type),


    _lit: $ => choice(
      $.integer,
      $.bool,
      $.float,
    ),

    integer: $ => /[0-9]+/,
    bool: $ => /(true|false)/,
    float: $ => /[0-9]+\.[0-9]+/,

    self: $ => seq(
      optional('*'),
      'self'
    ),

    _method_sig: $ => seq(
      '(',
      $.self,
      repeat(seq(
        ',',
        $.identifier,
        ':',
        $._type,
      )),
      ')',
      optional(seq(
        '->',
        $._type,
      )
      )
    ),

    _function_sig: $ => seq(
      '(',
      optional(seq(
        $.identifier,
        ':',
        $._type,
        repeat(seq(
          ',',
          $.identifier,
          ':',
          $._type,
        )))),
      ')',
      optional(seq(
        '->',
        $._type,
      ))),


    comment: $ =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  }
});
