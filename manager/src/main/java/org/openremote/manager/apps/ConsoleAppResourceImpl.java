/*
 * Copyright 2017, OpenRemote Inc.
 *
 * See the CONTRIBUTORS.txt file in the distribution for a
 * full listing of individual contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package org.openremote.manager.apps;

import org.openremote.container.web.WebResource;
import org.openremote.model.Constants;
import org.openremote.model.apps.ConsoleAppConfig;
import org.openremote.model.apps.ConsoleAppResource;
import org.openremote.model.http.RequestParams;

import javax.ws.rs.BeanParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.nio.file.Paths;

public class ConsoleAppResourceImpl extends WebResource implements ConsoleAppResource {

    final protected ConsoleAppService consoleAppService;

    public ConsoleAppResourceImpl(ConsoleAppService consoleAppService) {
        this.consoleAppService = consoleAppService;
    }

    @Override
    public String[] getInstalledApps(@BeanParam RequestParams requestParams) {
        if (!isSuperUser()) {
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }
        try {
            return consoleAppService.getInstalled();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    // Left here as android console stops working once this is removed
    @Override
    public ConsoleAppConfig getAppConfig(RequestParams requestParams) {
        return consoleAppService.getAppConfig(getRequestRealm());
//        String realm = getRequestRealm() != null ? getRequestRealm() : Constants.MASTER_REALM;
//        return Response.seeOther(URI.create("../" + ConsoleAppService.CONSOLE_APP_CONFIG_PATH + "/" + realm + ".json")).build();
    }
}
