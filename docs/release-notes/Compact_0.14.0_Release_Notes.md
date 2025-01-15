---
id: compact-0-14-0
title: Compact 0.14.0
pagination_next: null
pagination_prev: null
hide_table_of_contents: true
displayed_sidebar: docsSidebar
---

# Compact 0.14.0

Today we are releasing version 0.21.0 of the Compact compiler. This release updates the language version to 0.14.0, which contains a number of improvements over language version 0.13.x, and some breaking changes. This is a big update to the language, so read these release notes carefully to understand the changes.

The new release is available for you to try out. If you recompile your Compact code with the new compiler, you may need to update your code to accommodate the breaking changes.

## Key Changes

- **[Breaking change] Witness return values may need to be “disclosed”**
- Square brackets construct TypeScript-compatible tuples.
- You can use TypeScript-compatible destructuring.
- **[Breaking change] The Void type is removed.**
- **[Breaking change] The syntax of for loops is aligned with TypeScript.**
- **[Breaking change] The Cell ledger ADT is now implicit.**
- **[Breaking change] Ledger ADT names are now part of the standard library.**
- Exported circuits are allowed to have the same name as witnesses.
- Improved syntax error messages.

### [Breaking Change] Witness Return Values May Need to Be “Disclosed”

In Compact, witness return values are assumed to be private data. Before version 0.14.0, these private values could be unintentionally “leaked”. Primarily this would occur when the witness return value was written to the contract’s public ledger state.

In version 0.14.0, we have added a data flow analysis to the compiler which tracks the flow of witness return values through the contract. It will now be a compile-time error to leak these values. Such leakage can occur by writing them, either directly or indirectly, to the contract’s public ledger state. It can also occur if such a value is returned from an exported circuit, either directly or indirectly. Indirect leakage occurs when a value derived from a witness return value is leaked.  

If this leakage is intentional, you can tell the compiler by wrapping the witness return value with the new builtin syntax `disclose`. This wrapping just has to occur somewhere on the control flow path between the witness call and the data leak.

As an example, consider the `post` circuit from the [Bulletin Board tutorial example](https://docs.midnight.network/develop/tutorial/creating/bboard-contract). The pre-0.14.0 version of this code was:

```
export circuit post(new_message: Opaque<"string">): [] {
    assert state == STATE.vacant
        "Attempted to post to an occupied board";
    poster = public_key(local_secret_key(), instance as Field as Bytes<32>);
    message = some<Opaque<"string">>(new_message);
    state = STATE.occupied;
}
```

The call to the witness `local_secret_key` returns presumably private data. In Compact 0.14.0, there is a compiler error in this contract. The private data is passed to the circuit `public_key` where it is hashed with the standard library’s `persistent_hash`. The result of this call is also presumably private data, because it’s derived from the witness return value. Writing this data to the contract’s public ledger field `poster` is an error: 

```
Exception: bboard.compact line 23, char 5:
  ledger-field update might leak private data from the following witnesses:
    local_secret_key at line 18, char 1
```

This can be fixed by disclosing the witness return value:

```
poster = public_key(disclose(local_secret_key()),
                    instance as Field as Bytes<32>);
```

It could also be fixed by disclosing the derived public key value:

```
poster = disclose(public_key(local_secret_key(),
                             instance as Field as Bytes<32>));
```

We prefer the second option above, because it makes it clear that what is being leaked is the result of the call to `public_key` (not precisely `local_secret_key`).

The Bulletin Board’s `take_down` circuit also passes the result of `local_secret_key()` to `public_key`, but this is not a leak of private data:

```
assert poster == public_key(local_secret_key(), instance as Field as Bytes<32>)
    "Attempted to take down post, but not the current poster";
```

The assert will be part of the ZK proof, but it will not publicly reveal the private data and no `disclose` is required.

## Why We Made This Change

We want contract developers to be deliberate about when they reveal potentially private data, so we’ve decided to make that disclosure explicit in the contract.

## How to Fix Your Code

If you compile your contract and get witness leak errors, then the simplest fix is to wrap the witness return value in `disclose`.

## Square Brackets Construct TypeScript-Compatible Tuples

Before Compact 0.14.0, square brackets were used to construct vectors. For example, `[0,1,2]` constructs a three-element vector, whose elements all have the same type. The type of this expression was `Vector<3,T>` where the element type `T` is the so-called least upper bound of the types of `0`, `1`, and `2`. In this case, that type is `Uint<0..2>` so the expression had type `Vector<3,Uint<0..2>>`.

In Compact 0.14.0, we are introducing TypeScript-compatible tuples, constructed with square brackets. These values have tuple types, which are also written in square brackets. There is no ambiguity between tuple values and tuple types, because Compact does not allow values where types are expected or vice versa. So for the example `[0,1,2]` above, the tuple type is `[Uint<0..0>,Uint<0..1>,Uint<0..2>]`.

Subtyping for tuple types works as you would expect. For example, the type above is a subtype of the type `[Uint<8>,Uint<8>,Uint<8>]`. Vector types still exist in Compact, any tuple type where all elements are the same type is exactly equivalent to a vector type. So this type is exactly the same type as `Vector<3,Uint<8>>`.

`map` and `fold` will work over any tuple that has a corresponding vector type. That is, they will work over any tuple whose type is a subtype of some vector type. More concretely, a tuple has a vector type exactly when the least upper bound of the tuple element types exists.

One way to view this change is that we now track the types of tuple elements precisely.

## You Can Use TypeScript-Compatible Destructuring

We have added TypeScript-compatible destructuring for tuples, vectors, and structs. This works in `const` binding statements and for circuit parameters, including anonymous (“arrow”) circuits. This works as described in the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring).

### Caveats

There are a few caveats where destructuring will not work exactly as in TypeScript:

- The `...` (“spread”) syntax to match multiple values is not yet supported.
- Destructuring does not work for ledger field assignments. If `x` and `y` are ledger fields and `t` is a tuple, you cannot write `[x,y]=t`.

## [Breaking Change] The Void Type Is Removed

Before Compact 0.14.0, there was a `Void` type that was intended to be similar to TypeScript’s `void` type. `Void` could be used as a return type, but it could not be written anywhere else where a type was expected. This led to some weird cases. If `f` was a `Void`-returning circuit, you could write `const x = f(0)` where `x` had type `Void`. But you could not give an explicit type `const x: Void = f()`. Likewise, you could map `f` over a vector: `map(f,[0,1,2,3])` which gave a vector with type `Vector<4,Void>` though the programmer could not write this type.

`Void` was a supertype of every Compact type. Technically, `Void` was a so-called “top type” with respect to supertyping. This means that if you had a `Void` returning circuit, you could return anything:

```
circuit foo(x: Uint<8>): Void {
  return 2 * x + 1;
}
```


## [Breaking Change] The Void Type Is Removed

Some programmers found this surprising. In Compact 0.14.0 we have removed the `Void` type. Now, a circuit or witness that doesn’t return a useful value should return the empty tuple `[]`, with type `[]`. The statement `return;` without a subexpression is shorthand for `return [];`. Likewise, a circuit with return type `[]` does not need an explicit return statement, it will implicitly return the value `[]` when control flow leaves the circuit without an explicit return.

Technically, the empty tuple is a so-called “unit type”. There is conceptually only a single value of this type, and it is not a supertype of any type other than itself. That means that the equivalent to the circuit `foo` above, returning `[]`, would be a compile time error because it returns a non-`[]` value.

### Why We Made This Change

We felt that the behavior of `Void` defied some expectations, and was too subtle for a smart contract language. Ideally, our void-like type would be a unit type and not a top type, but that behavior is very different from TypeScript’s `void` type.

### How to Fix Your Code

Wherever you have a return value of `Void`, you should change it to the empty tuple type `[]`. If you were returning a value of a type that wasn’t `Void`, that will now be an error and the code will have to be refactored slightly.

## [Breaking Change] The Syntax of For Loops Is Aligned with TypeScript

Before version 0.14.0, we had two forms of `for` loops. You could use it to loop over the elements of a vector in order by writing `for x in v do s`, where `v` was a vector and `s` was a statement. In this case, the variable `x` will range over the elements of `v` in order. You could also use it to loop over a range of numbers by writing `for x = m to n do s`, where `m` and `n` are number literals. This syntax is different in several ways from TypeScript’s `for` loop.

In Compact 0.14.0 we’ve removed the difference to align with TypeScript. The first syntax above to loop over the elements of a vector is now written `for (const x of v) s`. The keyword `const` makes it clear that we are binding `x` on each iteration, and the non-TypeScripty keywords `in` and `do` are gone. Instead we use the same keyword as TypeScript (`of`) for iterating over a collection, and the body is just a statement (without `do`).

The second syntax uses our syntax for ranges and is now written `for (const x of m..n) s`.

### Why We Made This Change

This is a change to remove a superficial syntactic difference from TypeScript.

### How to Fix Your Code

Code with `for` loops will need to change to use the new syntax.

## [Breaking Change] The Cell Ledger ADT Is Now Implicit

Before version 0.14.0, a ledger field could store a Compact value by declaring it to have the ledger ADT type `Cell<T>` where `T` was some Compact type. This ADT has operations `read`, `write`, `reset_to_default`, and `write_coin`.

This was the only way that a Compact value could appear directly (that is, not in a structure like a `Set`, `List`, or `Map`) in the ledger. With version 0.14.0, we have removed explicit `Cell` from ledger declarations. Now, if you declare a ledger field to have a Compact type, it is implicitly a cell. For example, the ledger field `ledger state: Cell<STATE>` from the Bulletin Board example DApp would now be declared `ledger state: STATE`. Declaring it with `Cell` is an error.

Cells still exist in the ledger, and they still work exactly as before. There is an implicit call to `read` if a ledger cell value is used as a Compact value, and the assignment syntax `x = e` is shorthand for a call to `write` (that is, `x.write(e)`).

### Why We Made This Change

Explicitly declaring `Cell` was not necessary for disambiguation. It is simpler to have it be implicit in the ledger field declarations. Furthermore, `Cell` was already implicit when the type of a `Map` value was an ordinary Compact type, which was inconsistent.

### How to Fix Your Code

Remove `Cell` and a matching pair of angle brackets from ledger field declarations.

## [Breaking Change] Ledger ADT Names Are Now Part of the Standard Library

Before version 0.14.0, ledger ADT type names (and kernel functions) were builtin top-level identifiers. With version 0.14.0, we have placed them in the standard library. If you were using any of these names, you will now have to import the builtin module `CompactStandardLibrary`.

### Why We Made This Change

This change gives more flexibility over naming. For instance, if a programmer wanted to have their own type `Counter`, then they could avoid the name clash with the ledger ADT by writing `import CompactStandardLibrary prefix Std_;`. Then they could refer to their own `Counter` as `Counter` and refer to the ledger ADT as `Std_Counter`. Eventually, we will likely provide a way to selectively import specific names, or to hide specific names, or more flexible control over renaming, which makes this change even more convenient.

### How to Fix Your Code

If you were not importing the standard library before, you should import the standard library. This may require renaming if name clashes are introduced.

## Exported Circuits Are Allowed to Have the Same Name as Witnesses

Before 0.14.0, we did not allow an exported circuit to have the same name as a witness. With version 0.14.0, we have allowed that since the restriction was unnecessary. The overloading rules of the language have not changed, so if a call target is ambiguous it will still be a compiler error.

## We Have Improved Syntax Error Messages

The compiler release, `compactc` version 0.21.0 has a complete reworking of the way that syntax errors are signaled. Before, we reported a generic parser error with a line and column position. Sometimes the error was obvious, but sometimes it needed deep knowledge of the language grammar to understand what went wrong at that position.

Now, syntax errors will report what the parser was looking for at that location, and what it found instead.
