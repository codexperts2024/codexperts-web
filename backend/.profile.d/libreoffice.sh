# Ensure Heroku apt LibreOffice can resolve shared libraries (libreglo.so, etc.)
APT_ROOT="${APT_ROOT:-/app/.apt}"

export PATH="${APT_ROOT}/usr/bin:${APT_ROOT}/usr/lib/libreoffice/program:${PATH}"
export LD_LIBRARY_PATH="${APT_ROOT}/usr/lib/libreoffice/program:${APT_ROOT}/usr/lib/x86_64-linux-gnu:${APT_ROOT}/lib/x86_64-linux-gnu:${APT_ROOT}/usr/lib:${APT_ROOT}/lib:${LD_LIBRARY_PATH}"
export SAL_USE_VCLPLUGIN="${SAL_USE_VCLPLUGIN:-svp}"

if [ -z "${HOME}" ] || [ "${HOME}" = "/" ]; then
  export HOME=/tmp
fi
