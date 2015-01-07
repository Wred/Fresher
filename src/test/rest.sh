echo
echo GET all pages
curl \
 http://localhost/rest/page
echo
echo
echo GET specific page
curl \
 http://localhost/rest/page/53f29a1c4c90e828847f5343
echo
echo
echo POST page
curl \
 -H "Content-Type: application/json"\
 -X POST\
 -d '{"name":"New page","image":"page.gif","subs":[]}'\
 http://localhost/rest/page
echo
echo
echo GET all pages
curl \
 http://localhost/rest/page
echo
echo