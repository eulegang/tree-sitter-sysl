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
      $.function,
    ),

    constant: $ => seq(
      'let',
      $.identifier,
      ':',
      $._type,
      '=',
      $._expr,
      ';'
    ),

    variable: $ => seq(
      'mut',
      $.identifier,
      ':',
      $._type,
      '=',
      $._expr,
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
        $.function,
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
      seq($.identifier, '::', $.function)
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
      $._function_sig,
      '{',
      optional($._statements),
      '}'
    ),


    identifier: $ => /[a-zA-Z_][a-zA-Z_0-9]*/,

    _type: $ => choice(
      $.int_type,
      $.bool_type,
      $.float_type,
      $.slice_type,
      $.identifier_type,
      $.func_type,
    ),

    int_type: $ => choice(
      'i8',
      'i16',
      'i32',
      'i64',

      'u8',
      'u16',
      'u32',
      'u64',
    ),

    // /(i|u)(8|16|32|64)/,
    bool_type: $ => "bool",
    float_type: $ => choice(
      "f32",
      "f64",
    ),
    slice_type: $ => seq('[]', $._type),

    identifier_type: $ => seq($.identifier, repeat(seq('::', $.identifier))),

    func_type: $ => seq(
      '(',
      optional(seq(
        $._type,
        repeat(seq(
          ',',
          $._type,
        )))),
      ')',
      seq(
        '->',
        $._type,
      )),

    _lit: $ => choice(
      $.integer,
      $.bool,
      $.float,
    ),

    integer: $ => /[0-9]+/,
    bool: $ => choice("true", "false"),
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

    _statements: $ => repeat1($._statement),

    _statement: $ => choice(
      $.return,
      $.defer,
      seq($.call, ';'),
      $.cond,
      $.constant,
      $.variable,
    ),

    return: $ => seq('return', $._expr, ';'),
    defer: $ => seq('defer',
      choice(
        seq('{', optional($._statements), '}'),
        seq($._expr, ';'))),

    cond: $ => seq(
      $.cond_if,
      repeat($.cond_elif),
      optional($.cond_else)
    ),

    cond_if: $ => seq(
      'if',
      $._expr,
      '{',
      optional($._statements),
      '}',
    ),

    cond_elif: $ => seq(
      'else',
      'if',
      $._expr,
      '{',
      optional($._statements),
      '}'
    ),

    cond_else: $ => seq(
      'else',
      '{',
      optional($._statements),
      '}'
    ),

    _expr: $ => choice(
      $._lit,
      $.identifier,
      $.name_resolution,
      $.field_resolution,
      $.call,
    ),

    name_resolution: $ =>
      seq($.identifier, repeat1(seq('::', $.identifier))),

    field_resolution: $ =>
      seq($.identifier, repeat1(seq('.', $.identifier))),

    call: $ =>
      seq(
        field("func", $._expr),
        '(',
        field("params", optional(seq(
          $._expr,
          repeat(seq(
            ',',
            $._expr,
          )),
        )),
        ),
        ')',
      ),

    comment: $ =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  }
});
