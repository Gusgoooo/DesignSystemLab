# Product Alignment

Use this rule for long-term projects or product-wide alignment.

## Goal

Preserve page workflows while unifying the product's visual grammar.

## Align Across Pages

- app shell
- sidebar/header behavior
- page header rhythm
- content width rules
- section spacing
- primary action placement
- card/table/form/detail patterns
- empty/loading/error state tone
- responsive behavior

## Product Character Rule

Do not produce a generic shadcn SaaS look.

Use shadcn primitives as implementation material, but create product-specific rhythm through:

- page header hierarchy
- density
- surface contrast
- card grouping
- navigation emphasis
- primary action placement
- restrained brand color usage

The final UI should feel like this product using shadcn, not shadcn pasted onto this product.

## Do Not

- deliver isolated page makeovers with unrelated layout styles
- force unrelated page types into the same layout
- replace working information architecture for novelty
- introduce decorative cards, badges, or icons just to look more shadcn

## Product-Wide QA

Before final report, state:

1. what content and workflow stayed unchanged
2. what page patterns were unified
3. what old UI debt was removed
4. what semantic token pairs were checked
5. what responsive states were checked
6. which pages still need alignment
