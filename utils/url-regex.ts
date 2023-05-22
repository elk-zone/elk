import {
  validDomain,
  validPortNumber,
  validUrlPath,
  validUrlPrecedingChars,
  validUrlQueryChars,
  validUrlQueryEndingChars,
} from 'twitter-text/dist/regexp'
import regexSupplant from 'twitter-text/dist/lib/regexSupplant'

// The difference with twitter-text's extractURL is that the protocol isn't
// optional.

export const urlRegex = regexSupplant(
  '(' // $1 URL
    + '(#{validUrlPrecedingChars})' // $2
    + '(https?:\\/\\/)' // $3 Protocol
    + '(#{validDomain})' // $4 Domain(s)
    + '(?::(#{validPortNumber}))?' // $5 Port number (optional)
    + '(\\/#{validUrlPath}*)?' // $6 URL Path
    + '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?' // $7 Query String
  + ')',
  {
    validUrlPrecedingChars,
    validDomain,
    validPortNumber,
    validUrlPath,
    validUrlQueryChars,
    validUrlQueryEndingChars,
  },
  'gi',
)
