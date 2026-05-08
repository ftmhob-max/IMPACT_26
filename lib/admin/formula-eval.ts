/**
 * Safe recursive-descent expression evaluator.
 * No eval(), no Function(). Supports: +,-,*,/,^, unary minus, parentheses,
 * numeric literals, named variables, and a whitelist of Math functions.
 *
 * Grammar:
 *   expr     = additive
 *   additive = multip  ( ('+' | '-') multip )*
 *   multip   = power   ( ('*' | '/') power  )*
 *   power    = unary   ( '^'         unary  )*    right-associative
 *   unary    = '-' unary | primary
 *   primary  = NUMBER | IDENT '(' args ')' | IDENT | '(' expr ')'
 *   args     = expr ( ',' expr )*
 */

const ALLOWED_FNS: Record<string, (...args: number[]) => number> = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  log: Math.log10,
  ln: Math.log,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  pow: Math.pow,
  min: Math.min,
  max: Math.max,
};

class ParseError extends Error {}

interface Tokens {
  src: string;
  pos: number;
}

function peek(t: Tokens): string {
  skipWs(t);
  return t.pos < t.src.length ? t.src[t.pos] : "";
}

function skipWs(t: Tokens) {
  while (t.pos < t.src.length && /\s/.test(t.src[t.pos])) t.pos++;
}

function consume(t: Tokens, ch: string) {
  skipWs(t);
  if (t.src[t.pos] !== ch) throw new ParseError(`Expected '${ch}' at position ${t.pos}`);
  t.pos++;
}

function parseNumber(t: Tokens): number {
  skipWs(t);
  const start = t.pos;
  if (/[0-9]/.test(t.src[t.pos]) || (t.src[t.pos] === "." && /[0-9]/.test(t.src[t.pos + 1]))) {
    while (t.pos < t.src.length && /[0-9.]/.test(t.src[t.pos])) t.pos++;
    if (t.src[t.pos] === "e" || t.src[t.pos] === "E") {
      t.pos++;
      if (t.src[t.pos] === "+" || t.src[t.pos] === "-") t.pos++;
      while (t.pos < t.src.length && /[0-9]/.test(t.src[t.pos])) t.pos++;
    }
    return parseFloat(t.src.slice(start, t.pos));
  }
  throw new ParseError(`Expected number at position ${t.pos}`);
}

function parseIdent(t: Tokens): string {
  skipWs(t);
  const start = t.pos;
  if (!/[a-zA-Z_]/.test(t.src[t.pos])) throw new ParseError(`Expected identifier at position ${t.pos}`);
  while (t.pos < t.src.length && /[a-zA-Z0-9_]/.test(t.src[t.pos])) t.pos++;
  return t.src.slice(start, t.pos);
}

function parsePrimary(t: Tokens, vars: Record<string, number>): number {
  skipWs(t);
  const ch = t.src[t.pos];

  if (ch === "(") {
    t.pos++;
    const v = parseAdditive(t, vars);
    consume(t, ")");
    return v;
  }

  if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(t.src[t.pos + 1]))) {
    return parseNumber(t);
  }

  if (/[a-zA-Z_]/.test(ch)) {
    const name = parseIdent(t);
    skipWs(t);
    if (t.src[t.pos] === "(") {
      // function call
      const fn = ALLOWED_FNS[name];
      if (!fn) throw new ParseError(`Unknown function: ${name}`);
      t.pos++;
      const args: number[] = [];
      skipWs(t);
      if (t.src[t.pos] !== ")") {
        args.push(parseAdditive(t, vars));
        while (t.src[t.pos] === ",") {
          t.pos++;
          args.push(parseAdditive(t, vars));
        }
      }
      consume(t, ")");
      return fn(...args);
    }
    // variable
    if (!(name in vars)) throw new ParseError(`Undefined variable: ${name}`);
    return vars[name];
  }

  throw new ParseError(`Unexpected character '${ch}' at position ${t.pos}`);
}

function parseUnary(t: Tokens, vars: Record<string, number>): number {
  skipWs(t);
  if (t.src[t.pos] === "-") {
    t.pos++;
    return -parseUnary(t, vars);
  }
  if (t.src[t.pos] === "+") {
    t.pos++;
    return parseUnary(t, vars);
  }
  return parsePrimary(t, vars);
}

function parsePower(t: Tokens, vars: Record<string, number>): number {
  const base = parseUnary(t, vars);
  skipWs(t);
  if (t.src[t.pos] === "^") {
    t.pos++;
    const exp = parsePower(t, vars); // right-associative recursion
    return Math.pow(base, exp);
  }
  return base;
}

function parseMultip(t: Tokens, vars: Record<string, number>): number {
  let result = parsePower(t, vars);
  skipWs(t);
  while (t.src[t.pos] === "*" || t.src[t.pos] === "/") {
    const op = t.src[t.pos++];
    const right = parsePower(t, vars);
    result = op === "*" ? result * right : result / right;
    skipWs(t);
  }
  return result;
}

function parseAdditive(t: Tokens, vars: Record<string, number>): number {
  let result = parseMultip(t, vars);
  skipWs(t);
  while (t.src[t.pos] === "+" || t.src[t.pos] === "-") {
    const op = t.src[t.pos++];
    const right = parseMultip(t, vars);
    result = op === "+" ? result + right : result - right;
    skipWs(t);
  }
  return result;
}

export function evalExpression(expr: string, vars: Record<string, number>): number {
  const t: Tokens = { src: expr.trim(), pos: 0 };
  const result = parseAdditive(t, vars);
  skipWs(t);
  if (t.pos < t.src.length) {
    throw new ParseError(`Unexpected token at position ${t.pos}: '${t.src[t.pos]}'`);
  }
  return result;
}

export function validateExpression(
  expr: string,
  varKeys: string[]
): { ok: true } | { ok: false; error: string } {
  if (!expr.trim()) return { ok: false, error: "Expression is empty." };
  const dummyVars: Record<string, number> = {};
  for (const k of varKeys) dummyVars[k] = 1;
  try {
    const result = evalExpression(expr, dummyVars);
    if (!isFinite(result)) return { ok: true }; // divide-by-zero with dummy 1s is acceptable
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ParseError ? e.message : "Invalid expression." };
  }
}
