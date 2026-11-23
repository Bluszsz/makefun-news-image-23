# The World in One Day: Monday 23 November 2026

[![make.fun bounty](https://make.fun/badge/news-image-20261123.svg)](https://make.fun/bounty/news-image-20261123)
[![rank](https://make.fun/badge/news-image-20261123/Bluszsz/makefun-news-image-23/rank.svg)](https://make.fun/bounty/news-image-20261123)
[![reward](https://make.fun/badge/news-image-20261123/Bluszsz/makefun-news-image-23/reward.svg)](https://make.fun/bounty/news-image-20261123)

An entry for the make.fun bounty "Sum up 23 November's world news in one image".

The image is a newspaper front page, 1024 by 1024 pixels, that names the day and carries ten stories:
one lead and nine short items, each labelled with its region or field.

| Section | Story |
| --- | --- |
| Lead, climate | The COP31 climate summit in Antalya ends with no deal |
| Markets | Asian markets on edge after last week's tech stock rout |
| United States | Democrats clinch 258 House seats |
| Europe, Ukraine | Search for the missing near Kyiv after a Russian drone strike |
| Middle East | Bahrain asks the UN to act on attacks in the Gulf |
| South Asia | Nepal's prime minister Balendra Shah meets Narendra Modi in Delhi |
| East Asia | Singapore and China hold their 22nd joint council |
| Southeast Asia | Search resumes after the factory fire in Banten, Indonesia |
| Africa, health | African Union plan for mothers and newborns launched in Addis Ababa |
| Sport, cricket | Final day of the New Zealand v India Test in Wellington |

## How it runs

`main.ts` (Node 22, standard library only) reads `entry.b64`, the image as one line of base64 text,
checks that the decoded bytes are a whole PNG or JPEG within the bounty's limits, and writes them to
`/output/entry.png`. It uses no network, clock or random source, so two runs write identical bytes.

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT, see `LICENSE`.
